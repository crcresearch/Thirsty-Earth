################ Function for water use and profit each year ############################################################
#Lauren McGiven & Marc Muller, January 2023
#Some material from Irrigania (Seibert & Vis, 2012): https://doi.org/10.5194/hess-16-2523-2012
#Some material from (Hoekstra, 2012): https://doi.org/10.5194/hess-16-2985-2012

#This function is applied individually for a single village. There will be no upstream or downstream villages.
#rm(list=ls())
library(tidyverse)

#* @filter cors
cors <- function(res) {
    res$setHeader("Access-Control-Allow-Origin", "*")
    plumber::forward()
}

#######################################################################################################################################################################################
function(Wa,Cr,IB,GD,r0, P, Ld, dP, dLd, QNS, QFS, QNG0, QNG, QFG, rhoRF, rhoRS, rhoRG, rhoR, aF, EPR, k, aCr, lambda){
 
  #Test function with fake arguments - COMMENT OUT TO PLAY GAME:
# 
#   #Play Parameters passed as argument
#   Wa=matrix(sample(c(0,1,2,3),(54),T),ncol=9) #matrix of individual choice per field (here nine fields and six players). 0,1,2,3 indicate fallow, groundwater, surface water and rain
#   Cr=matrix(sample(c(0,1),54,T),ncol=9) #crop type per field per player
#   IB = sample(c(1,0), 6, replace = T, prob = c(.35,.65)) #binary vector indicating which information bits to purchase
# 
#   #Test function with everyone taking the optimal amounts! (just different test fake arguments)
#   Wa=rbind(c(1,1,2,2,2,3,3,0,0), c(1,1,2,2,2,3,3,0,0), c(1,1,2,2,2,3,3,0,0), c(1,1,2,2,2,3,3,0,0), c(1,1,2,2,2,3,3,0,0), c(1,1,2,2,2,3,3,0,0))
#   #2 groundwater fields, 3 surface water fields, 2 rain field, 2 fallow
#   Cr=matrix(0,nrow=6,ncol=9) #all low value crops to see how it goes
# 
#   ### INITIALIZATION (Parameters passed as argument)
#   #GD=rep(0,6) #Starting GW depth
#   r0=1 #rain value of previous year
#
#  ######################## FOR CRC: ############################################
#  #Game creation important parameters moderator can change: P, Ld, dP, dLd, rhoR, rhoRF, rhoRS, rhoRG, aCr, Pen
#  #If possible - Advanced settings option: QNS, QFS, QNG0, QNG, QFG, aF, EPR, k, lambda
#  #set current values as default parameter values 
#   ######### FREE CLIMATE PARAMETERS - important for game creation
#   # Parameters for rain (by default, 50% probability of good year and no autocorrelation)
#   P=0.5 #prob of wet/good year (also passed as argument)
#   Ld=1 #average length of dry spell (also passed as argument)
#   #Climate change
#   dP=0 #annual increase in annual probability of wet year
#   dLd=0 # annual increase in average length of dry spell
# 
#   ########## FREE ECON PARAMETERS 
#   #Important game creation parameters:
#   #Ratio of Utility for rain vs irrigation
#   rhoRS=0.35 #for surface water
#   rhoRG=0.25 #for groundwater
#   rhoR=0.5 #Multiplier for profit (and recharge) for normal crops for bad vs good rain year.
#   rhoRF = 1.3 #the ratio between expected unit returns from rain fed crops and outside wages
#   aCr=2 #Multiplier for both profit and water use for high value crops.
#   Pen=2 #Profit penalty per person for added public information (lump sum per bit)
#   
#   #Advanced settings: 
#   #Optimal Fields allocation per player for surface water.
#   QNS=4 #Nash (selfish)
#   QFS=3 #First best (community)
#   #Optimal Field allocation per player for groundwater
#   QNG0=5  #Myopic Nash (period 1)
#   QNG=3 #Sustainable Nash
#   QFG=2 #Sustainable first best
#   aF = 1 #profit from leaving one marginal field fallow
#   EPR= 5 #Expected groundwater recharge
#   k=1.25 #Recession constant per period.
#   lambda = 0.1 #the ratio of maximum losses to expected recharge; describes relative water level at steady state; 1 = completely full at steady state
#   

  #################  #################  #################  #################  #################  #################  #################  #################
  ####### CRC Plumber Parameter Type Transformation #######
  Wa = matrix(as.numeric(str_split_1(Wa,"")), ncol=9, byrow=TRUE)
  Cr = matrix(as.numeric(str_split_1(Cr,"")), ncol=9, byrow=TRUE)
  IB = sample(c(1,0), 6, replace = T, prob = c(.35,.65))
  GD = as.integer(GD)
  r0=as.integer(r0)   
  P = as.numeric(P) 
  Ld = as.numeric(Ld)
  dP = as.numeric(dP)
  dLd= as.numeric(dLd)
  QNS = as.numeric(QNS)
  QFS = as.numeric(QFS)
  QNG0 = as.numeric(QNG0)
  QNG = as.numeric(QNG)
  QFG = as.numeric(QFG)
  rhoR = as.numeric(rhoR)
  rhoRS = as.numeric(rhoRS)
  rhoRG = as.numeric(rhoRG)
  rhoRF = as.numeric(rhoRF)
  aF = as.numeric(aF)
  EPR = as.numeric(EPR)
  k = as.numeric(k)
  aCr = as.numeric(aCr)
  Pen = as.numeric(Pen)
  lambda = as.numeric(lambda)

  #Initial Checks
  if(max(Wa)>3) stop('Wa must be between 0 and 3')
  if(nrow(Wa)!=nrow(Cr)) stop('Wa and Cr must have the same number of players (rows)')
  if(ncol(Wa)!=ncol(Cr)) stop('Wa and Cr must have the same number of fields (columns)')
  if(QNS+QNG>9) stop('Number of fields cannot be more than 9')
  if(QNS+QNG0>9) stop('Number of fields cannot be more than 9')
  if(QFS+QFG>9) stop('Number of fields cannot be more than 9')
  if(QFS>QNS) stop('QNS should not be larger than QFS')
  if(QNG>QNG0) stop('QNG should not be larger than QNG0')
  if(QFG>QNG) stop('QFG should not be larger than QNG')
  if(2*QFS <= QNS) stop('2*QFS must be larger than QNS because math')
  if(2*QFG == QNG) stop('2*QFG cannot be equal to QNG because math')
  if(QNG/QFG>=2) stop('QNG/QFG must be less than 2 because math')
  if(QNG*(k+1)<= QNG0) stop('QNG*(k+1) must be larger than QNG0')
  if(lambda<0 | lambda>=1) stop('lambda must be between 0 and 1')
  if(rhoR>1) stop('The multiplier should be higher in a good year than a bad year')
  if(aCr<1) stop('High value crops should be more profitable than low value crops')
  
  #warnings:
  if(rhoRS>=1) warning('Surface water should be more profitable than rain water')
  if(rhoRG>=1) warning('Groundwater should be more profitable than rain water')
  if(rhoRS<rhoRG) warning('Value of irrigation types should be GW > SW > RW')
  if(rhoRF<=1) warning('Expected profit from rain fed crops should be higher than fallow')
  if(rhoRF>=1.5) warning('Rain fed crops should be less profitable than fallow in a bad year') 
  if(QNG==4) warning('SW profits become negative before GW')

  ##########   Rainfall year  ##########
  # Rain is a binary markov chain.
  #For rain: 1 = dry/bad year, 2 = wet/good year
  #P01 and P11 equations from (Muller & Thompson, 2013) https://doi.org/10.1016/j.advwatres.2013.08.004
  P=min(c(max(c(1e-6,P+dP)),1-1e-6))
  Ld=max(c(1,Ld+dLd))
  P1=P
  P01 = 1/Ld #prob of going from a dry year to wet year
  P11 = 1 + P01 - (P01/P1) #P00 - prob of going from a dry year to a dry year
  P10 = 1 - P11 #P10 - prob of going from a wet year to a dry year 
  P00 = 1 - P01 #P00 - prob of going from a dry year to a dry year 
  rain = ifelse(r0==1, sample(0:1,1,F,c(P00,P01)), sample(0:1,1,F,c(P10,P11))) + 1 #bad(1) or good(2) year
  
  
  #DERIVED PARAMETERS 
  N=nrow(Wa) #number of players
  
  #Rain
  aR1 = (aF*rhoRF)/(P+rhoR-(P*rhoR)) #unit profit per field in a good year
  aR2 = (aF*rhoRF)/(P+rhoR-(P*rhoR))*rhoR #unit profit per field in a bad year
  
  #Surface Water
  R1 = (1/QNS)-(1/(2*QFS)) #should be larger than 0 
  R2 = (2*(QNS-QFS)) / ((N-1)*((2*QFS)-QNS)) #should be within [0,1]
  aS = ((aF*rhoRF)/rhoRS)*(1/(1-R1-(R1*R2*(N-1)))) #unit benefit from surface water
  bS1 = aS*R1 #multiplier for cost of own consumption
  bS2 = aS*R1*R2 #multiplier for cost of other farmers' consumption
  
  #Groundwater
  RG1 = (2-(QNG/QFG)) / (2*QNG0)
  RG2 = (-2*(QFG-QNG)) / ((N-1)*((2*QFG)-QNG))
  RG3 = (2*QFG*(QNG+(k*QNG)-QNG0))/((2*QFG) - QNG)
  aG = ((aF*rhoRF)/rhoRG)*(1/(1+(RG1*(RG3-k*QNG-k*QNG*(N-1)*RG2-(N-1)*RG2-1)))) #unit benefit per GW irrigated field 
  bG1 = aG*RG1 #multiplier for cost of own consumption
  bG2 = aG*RG1*RG2 #multiplier for cost of other farmers' consumption
  dm = lambda*k*EPR #max depth of aquifer
  bG = (RG3*bG1) / (k*EPR*(1-lambda))
  r1 = EPR / (P+rhoR - (rhoR*P)) #recharge amount for a good year
  r2 = rhoR*(EPR / (P+rhoR - (rhoR*P))) #recharge amount for a bad year
  
  #NON NEGATIVITY AND OTHER BOUNDS CONDITIONS on all parameters:
  if(R2<0 | R2>1) stop('R2 must be between 0 and 1')
  if(RG2<0 | RG2>1) stop('RG2 must be between 0 and 1')
  if(R1<0) stop('R1 must be positive')
  if(RG1<0) stop('RG1 must be positive')
  if(RG3<0) stop('R5 must be positive')
  if(aR1<0) stop('aR1 must be positive')
  if(aR2<0) stop('aR2 must be positive')
  if(bS1<0) stop('bS1 must be positive')
  if(bS2<0) stop('bS2 must be positive')
  if(aS<0) stop('aS must be positive')
  if(aG<0) stop('aG must be positive')
  if(bG1<0) stop('bG1 must be positive')
  if(bG2<0) stop('bG2 must be positive')
  if(bG<0) stop('bG must be positive')
  if(dm<0) stop('dm must be positive')
  if(r1<0) stop('r1 must be positive')
  if(r2<0) stop('r2 must be positive')
  if(r2>r1) stop('recharge in a bad year should be less than a good year')
  if(aR2>aR1) stop('profits in a bad year should be less than a good year')
  if(bS2>bS1) stop('Self SW contribution parameter should be greater than everyone elses')
  if(bG2>bG1) stop('Self pumping contribution parameter should be greater than everyone elses')
  if(2*bS1+N*bS2 == bS2) stop('Math constraint')
  if((2*N*QFG)+QNG == (2*QFG)+(N*QNG)) stop('Math constraint')
  
  
  #################  #################  #################  #################  #################  #################  #################  #################
  #Explicitly compute the sustainable depth using Qi = Qj = QFS
  psi1 = bG1/bG
  psi2 = bG2/bG
  dsus = k*(psi1*QNG + psi2*(N-1)*QNG - EPR) + dm
  #Ensure the game makes sense with the theoretical sustainable depth greater than 0
  if(dsus<0) stop('Sustainable pumping depth cannot be negative')
  
  #################  #################  #################  #################  #################  #################  #################  #################
  #Create profit functions
  
  #rain utility function per player
  uR=function(q){
    if (rain==2) {
      uR= q*aR1 #good year profit
    } else if (rain == 1) {
      uR = q*aR2 } #bad year profit
    return(list(uR=uR)) 
  }
  
  uS=function(q){
    uS = vector()
    uC_S = vector()
    for (i in 1:length(q)){
      uS[i] = (aS*q[i]-q[i]*(q[i]*bS1+sum(q[-i])*bS2))
      uC_S[i] = q[i]*(q[i]*bS1+sum(q[-i])*bS2)}
    return(list(uS=round(uS,2), uC_S = round(uC_S,2))) #surface water utility function per player, q is a vector
  }
  
  uG=function(q,GD){
    dd = vector()
    uG = vector()
    d = vector()
    uC_G = vector()
    
    if (rain==2) {
      re = r1 #good year recharge
    } else if (rain == 1) {
      re = r2 } #bad year recharge
    
    for (i in 1:length(q)){
      #GW profit depends on current depth after abstractions
      dd[i] = (bG1/bG)*q[i] + (bG2/bG)*sum(q[-i]) - re + ((dm-GD[i])/k) #change in depth, pos. change if decreasing level
      d[i] = GD[i] + dd[i] #new depth 
      if(sum(d<0)>0) warning('Should not have negative depth')
      d[which(d<0)]<-0
      
      #here we compute the effect of pumping a vector q
      #profit, depends on antecedent d and current pumping
      uG[i] = ((aG-bG*d[i])*q[i] - q[i]*(q[i]*bG1+sum(q[-i])*bG2)) 
      #Total Pumping costs 
      uC_G[i] = (bG*d[i]*q[i]) + q[i]*(q[i]*bG1 + sum(q[-i])*bG2) }
    
    return(list(uG=round(uG,2), d=d, uC_G = round(uC_G)))} #sustainable groundwater utility function per player and new groundwater depth
  
  #################  #################  #################  #################  #################  #################  #################  #################
  ### Plot the utility functions and chosen optimal values
  # PDF device
#  pdf("Optimal Profits.pdf") #the specific pathway to your library can be placed in front of "Optimal Profits.pdf"
#
#  Gprof = vector()
#  Sprof = vector()
#  RGprof = vector()
#  RBprof = vector()
#  RAprof = vector()
#  Fprof = vector()
#  qPlot=0:6 #abstractions of each player
#
#  rrr=rain
#  for (i in qPlot){ #the mean profit will be the profit all players receive bc using same econ conditions
#    qs=rep(i,N)  #vector with every player (6 total) taking the same GW
#
#    ds = k*(psi1*i + psi2*(N-1)*i - EPR) + dm #vector of depths required for sustainable pumping
#    if (ds<0) {ds=0}
#    if (ds<0) warning('negative ds')
#    
#    Gprof[i+1] = i*(aG-bG*ds) - (i^2)*bG1 - i*bG2*(N-1)*i
#    
#    Sprof[i+1] = mean(uS(qs)$uS) #surface water profit
#    RAprof[i+1] = i*(aR1*P+(1-P)*aR2) #expected rain profit
#    Fprof[i+1] = i*aF
#    
#    rain=2 #good year
#    RGprof[i+1] = mean(uR(qs)$uR) #rainfed profit good year
#
#    rain=1 #bad year
#    RBprof[i+1] = mean(uR(qs)$uR) #rainfed profit bad year
#  }
#  rain=rrr
#
#  ggplot(data.frame(Village_Q = qPlot, Profit=Gprof, SW_Profit = Sprof, RGp = RGprof, RBp = RBprof, Fprof = Fprof), aes(x=Village_Q))+
#    geom_line(aes(y=Profit), color='brown')+            #GW sustainable expected profit
#    geom_line(aes(y=SW_Profit), color='blue')+          #SW profit
#    geom_line(aes(y=RGp), color='green')+               #RW good year profit
#    geom_line(aes(y=RBp), color='darkgreen')+           #RW bad year profit
#    geom_line(aes(y=RAprof), color='darkgreen', lty=3)+ #RW expected profit
#    geom_line(aes(y=Fprof), color='black')+             #Fallow profit
#    geom_vline(xintercept=c(QNG,QFG,QNS,QFS),col=c('brown','brown', 'blue','blue'),lty=rep(c(1,2,1,2)))
#  
#  dev.off()  # Close device

  #LEGEND:
  #BROWN - GW profit
  #BLUE - SW profit
  #LIME GREEN - RW good year profit
  #DARK GREEN - RW bad year profit
  #GREEN DOTS - RW expected profit
  #BLACK - Fallow profit
  #NASH OPTIMAL - dotted
  #FIRST BEST OPTIMAL - solid

  #################  #################  #################  #################  #################  #################  #################  #################
  # Find the players' profits!
  
  ######## Non Irrigated Fields  ######## 
  
  #Rain fed
  Ri = data.frame(Ri=rowSums(1*Wa==3), RiCr=rowSums((aCr*Cr+!Cr)*(Wa==3))) #Number rain fields
  P_R = uR(Ri[[2]])$uR
  Rv = sum(Ri[1])/N ##Average number of fields irrigated with RW per player
  ERP = aR1*P + aR2*(1-P) #expected rain profits 
  RW = data.frame(Ri, ERP, round(P_R,2))
  names(RW)=c('Ri','RiCr','E[uB_R]','P_R')
  
  #Fallow
  Fi = data.frame(Fi=rowSums(1*(Wa==0)), uB_F=aF)%>%
    mutate(P_F=Fi*aF)  #number of fallow fields & fallow profits
  Fv = sum(Fi[1])/N #Average number of fields left fallow per player
  
  ######## Irrigated Fields  ######## 
  
  ##### Groundwater ##### 
  #Individual data 
  Gi = data.frame(Gi=rowSums(1*(Wa==1)),GiCr=rowSums((aCr*Cr+!Cr)*(Wa==1))) #Extract groundwater fields from action matrix
  #Village data
  Gv=sum(Gi[1])/N #Average number of fields irrigated with GW per player not accounting for high value crops
  
  #sustainable GW profits equation per player
  Gfun = uG(Gi[[2]],GD)
  P_G = Gfun$uG
  d_new = Gfun$d
  uC_G=Gfun$uC_G
  GW = data.frame(Gi, uB_G = round(aG,2), uC_G, P_G)
  
  ##### Surface Water ##### 
  Si = data.frame(Si=rowSums(1*(Wa==2)),SiCr=rowSums((aCr*Cr+!Cr)*(Wa==2)))
  Sv=sum(Si[1])/N #Average number of fields irrigated with SW per player not accounting for high value crops
  
  #Surface water profits equation per player
  Sfun = uS(Si[[2]])
  P_S = Sfun$uS
  uC_S=Sfun$uC_S
  SW = data.frame(Si, uB_S = round(aS,2), uC_S, P_S)
  
  #################  #################  #################  #################  #################  #################  #################  #################
  
  ########Gather important info: player decisions, profits, penalties, net profit
  df = RW%>%bind_cols(Fi)%>%bind_cols(SW)%>%bind_cols(GW)%>%mutate(P_Tot=Ri[2]+Fi[2]+P_S+P_G)%>%mutate(P_Net=P_Tot-Pen_C)
  
  ##### Institutions and penalties #####
  #This information is bought by players in order to check that rules/institutions are being followed 
  Pen_C = Pen*sum(IB) #number of information bits purchased for the village #total cost of information bits purchased
  
  InfoBits = data.frame(Gv, Sv, Rv, Fv, sum(Cr)/N, rain, round(mean(uC_G),2), round(mean(uC_S),2), round(mean(df$P_Net),2), which.max(df$P_Net), 
                        max(df$P_Net), which.max(Gi[[2]]), which.max(Si[[2]]))
  #1. What was the average number of fields irrigated with groundwater per player this year in our village?
  #2. What was the average number of fields irrigated with surface water per player this year in our village?
  #3. What was the average number of fields irrigated with rain per player this year in our village?
  #4. What was the average number of fields left fallow per player this year in our village?
  #5. How many high value crops were planted on average per player this year in our village?
  #6. Was this year a good or bad rain year?
  #7. What was the average unit groundwater cost over all players in the village this year? 
  #8. What was the average unit surface water cost over all players in the village this year?  
  #9. What was the average net profit for the village this year? 
  #10. Which player had the highest net profit this year?
  #11. What was the maximum net profit this year?
  #12. Which player used the most groundwater this year?
  
  # What was the maximum ground water units taken this year by a single player?
  
  #13. Which player used the most surface water this year?
  
  # What was the maximum surface water units taken this year by a single player?
  
  #randomly show a players play and player number

  
  ##^^LAST THING LAUREN NEEDS TO FINISH
  
 
  

  names(InfoBits)=c('Avg. # GW Fields','Avg. # SW Fields','Avg. # RW Fields', 'Avg. # Fallow Fields', 'Avg. # High Value Crops', 'Rain Year',
                    'Avg. GW Unit Cost','Avg. SW Unit Cost','Village Avg. Profit','Player # Max Profit', 'Max Village Profit', 'Player # Max GW', 
                    'Player # Max SW') 
  
  #######Public information for all players in the village
  Public = InfoBits[IB==1] #Information everyone in the village paid to see 
  
  #########Individual information to display to each player
  Private_const= data.frame(P, aR1, aR2, aS, bS1, bS2, aG, bG, bG1, bG2)
  #probability of a good rain year, good rain unit benefit, bad rain unit benefit, unit SW benefit, SW cost parameters, unit GW benefit, GW cost parameters, 
    
  Private_notconst = cbind(df[4], df[7], df[12], df[17], df[19], d_new)   #the profit for each type and net profits and the new depth for each player 
  #rain profit, fallow profit, SW profit, GW profit, Net profits, and new GW depth PER PLAYER
    
  return(list(df, Private_const, Private_notconst, Public, rain, d_new)) 
  #display Private_const, Private_notconst, and Public information to the respective players 
  
}

