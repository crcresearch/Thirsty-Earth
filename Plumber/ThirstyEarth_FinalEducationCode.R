################ Function for water use and profit each year ############################################################
#Lauren McGiven & Marc Muller, May 2023
#Inspiration from Irrigania (Seibert & Vis, 2012): https://doi.org/10.5194/hess-16-2523-2012
#and (Hoekstra, 2012): https://doi.org/10.5194/hess-16-2985-2012

#This function is applied individually for a single village. There will be no upstream or downstream villages.
#rm(list=ls())  #clear work space
library(tidyverse)

#* @filter cors
cors <- function(res) {
    res$setHeader("Access-Control-Allow-Origin", "*")
    plumber::forward()
}
#######################################################################################################################################################################################
#* Return the  of two numbers
#* @param Water:string #matrix of individual choice per field (here nine fields and six players). 0,1,2,3 indicate fallow, groundwater, surface water and rain
#* @param Crop:string #crop type per field per player
#* @param IB:[int] #binary vector indicating which information bits to purchase
#* @param GD:number #Starting GW depth from previous year
#* @param r0:int #rain value of previous year
#* @param P:number #prob of wet/good year
#* @param Ld:number #average length of dry spell (also passed as argument)
#* @param dP:number #annual increase in annual probability of wet year
#* @param dLd:number #annual increase in average length of dry spell
#* @param QFS:number #First best (community)
#* @param QNS:number #Nash (selfish)
#* @param QNG:number #Sustainable Nash
#* @param QFG:number #Sustainable first best
#* @param rhoRF:number #the ratio between expected unit returns from rain fed crops and outside wages 
#* @param rhoRS:number #for surface water
#* @param rhoRG:number #for groundwater
#* @param rhoR:number #Multiplier for profit (and recharge) for normal crops for bad vs good rain year. 
#* @param rhoRe:number #Multiplier for groundwater recharge in a bad vs good rain year.
#* @param aF:number #profit from leaving one marginal field fallow 
#* @param EPR:number #Expected groundwater recharge
#* @param k:number #Recession constant per period.
#* @param aCr:number #Multiplier for both profit and water use for high value crops.
#* @param lambda:number #the ratio of maximum losses to expected recharge; describes relative water level at steady state; 1 = completely full at steady state
#* @param aPen:number #percentage of the profit if all fields were fallow
#* @param VillageID:number #Village that is being called
#* @param PlayerIDs:string #The list of Player IDs
#* @param isHumanPlayer:string #a bit string of whether the player position is a human or bot
#* @param numPlayers:int #Number of players in this village
#* @post /calculate
ThirstyEarth = function(Water, Crop, IB, GD, r0, P, Ld, dP, dLd, QNS, QFS, QNG0, QNG, QFG, rhoRF, rhoRS, rhoRG, rhoR, rhoRe, aF, EPR, k, aCr, lambda, aPen, VillageID, PlayerIDs, isHumanPlayer, numPlayers, gameLabel, generateGraph){
  
  #################  #################  #################  #################  #################  #################  #################  #################
  ####### CRC Plumber Parameter Type Transformation #######
  numPlayers = as.numeric(numPlayers)
  Water = matrix(as.numeric(str_split_1(Water,"")), ncol=9, byrow=TRUE)
  Crop = matrix(as.numeric(str_split_1(Crop,"")), ncol=9, byrow=TRUE)
  IB = matrix(as.numeric(str_split_1(IB,"")), ncol=19, byrow=TRUE) #sample(c(1,0), 6, replace = T, prob = c(.35,.65))
  GD = matrix(as.numeric(str_split_1(GD,",")), ncol=numPlayers, byrow=TRUE)
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
  lambda = as.numeric(lambda)
  aPen = as.numeric(aPen)
  village = as.numeric(VillageID)
  rhoRe = as.numeric(rhoRe)
  IsHumanPlayer = matrix(as.numeric(str_split_1(isHumanPlayer,"")), ncol=numPlayers, byrow=TRUE) 

  Wa = Water+5 #Add 5 so I can replace all values without overwriting others; now 5-rain, 6-surface, 7-groundwater
  Cr = Crop+5 #Add 5 so low value crops and fallow aren't both 0; Now 5-fallow, 6-low value, 7-high value
  
  Wa[Wa==5] = 3 #rain water
  Wa[Wa==6] = 2 #surface water
  Wa[Wa == 7] = 1 #ground water
  Wa[Cr==5] = 0 #fallow
  
  Cr[Cr==6] = 0 #low value
  Cr[Cr==7] = 1 #high value

  Pen = aPen*9*aF #Lump sum profit penalty per person per bit for added public information
 
 # Test the function with fake arguments - COMMENT OUT TO PLAY GAME:
 
  # #Random Play Parameters + conversion:
  # Water=matrix(sample(c(0,1,2),(54),T),ncol=9)
  # Crop=matrix(sample(c(0,1,2),54,T),ncol=9)
  # #IB = sample(c(1,0), 19, replace = T, prob = c(.35,.65)) #binary vector indicating which information bits to purchase
  # 
  #   Wa = Water+5 #Add 5 so I can replace all values without overwriting others; now 5-rain, 6-surface, 7-groundwater
  #   Cr = Crop+5 #Add 5 so low value crops and fallow aren't both 0; Now 5-fallow, 6-low value, 7-high value
  #   Wa[Wa==5] = 3 #rain water
  #   Wa[Wa==6] = 2 #surface water
  #   Wa[Wa == 7] = 1 #ground water
  #   Wa[Cr==5] = 0 #fallow
  #   Cr[Cr==6] = 0 #low value
  #   Cr[Cr==7] = 1 #high value
  # 
  # #Bot Play Parameters, no conversion:
  # Wa=rbind(c(1,1,2,2,2,3,3,0,0), c(1,1,2,2,2,3,3,0,0), c(1,1,2,2,2,3,3,0,0), c(1,1,2,2,2,3,3,0,0), c(1,1,2,2,2,3,3,0,0), c(1,1,2,2,2,3,3,0,0))
  # #2 groundwater fields, 3 surface water fields, 2 rain field, 2 fallow
  # Cr=matrix(0,nrow=6,ncol=9) #all low value crops 
  # IB = rep(0,19)  #no information bits
  # 
  # #Example Play Parameters 1, no conversion:
  # Wa=rbind(c(1,1,1,1,2,2,2,2,2),c(1,1,1,1,2,2,2,2,2), c(1,1,1,1,2,2,2,2,2), c(1,1,1,1,2,2,2,2,2), c(1,1,1,1,2,2,2,2,2) ,c(1,1,1,1,2,2,2,2,2))
  # #Everyone takes 4 groundwater fields, 5 surface water fields
  # Cr=matrix(0,nrow=6,ncol=9) #all low value crops 
  # IB = rep(0,19) #no information bits
  # 
  # #Example Play Parameters 2, no conversion:
  # Wa=rbind(c(1,1,1,1,1,3,3,3,3), c(1,1,1,1,1,2,2,2,2),c(1,1,1,2,2,3,3,0,0),c(1,1,2,2,2,0,0,0,0),c(1,1,1,2,2,2,3,3,0),c(1,1,1,1,1,1,0,0,0))
  # #Person 1: 5 ground 4 rain, Person 2: 5 ground 4 Surface, Person 3: 3 ground 2 surface 2 rain 2 fallow, Person 4: 2 ground, 3 surface 4 fallow, Person 5: 3 ground 3 surface 2 rain 1 fallow, Person 6: 6 ground 3 fallow
  # Cr=matrix(1,nrow=6,ncol=9) #all high value crops
  # IB = rep(0,19) #no information bits

  
  # ### INITIALIZATION (Parameters passed as argument)
  # N=nrow(Wa) #number of players
  # GD=rep(0,N) #Starting GW depth
  # r0=2 #rain value of previous year

 ######################## FOR CRC: ############################################
 #Game creation important parameters moderator can change: P, Ld, dP, dLd, rhoR, rhoRe, rhoRF, rhoRS, rhoRG, aCr, Pen
 #If possible - Advanced settings option: QNS, QFS, QNG0, QNG, QFG, aF, EPR, k, lambda
 #set current values as default parameter values

 # ######### FREE CLIMATE PARAMETERS - important for game creation
 # # Parameters for rain (by default, 50% probability of good year and no autocorrelation)
 # P=0.5 #prob of wet/good year (also passed as argument)
 # Ld=1.25 #average length of dry spell (also passed as argument)
 # #Climate change
 # dP=0 #annual increase in annual probability of wet year
 # dLd=0 # annual increase in average length of dry spell
 # 
 # ########## FREE ECON PARAMETERS
 # #Important game creation parameters:
 # #Ratio of Utility for rain vs irrigation
 # rhoRS=0.10 #for surface water
 # rhoRG=0.06 #for groundwater
 # rhoR=0.15 #Multiplier for profit of a rainfed field in a bad vs good rain year.
 # rhoRe=0.8 #Multiplier for groundwater recharge in a bad vs good rain year.
 # rhoRF = 1.2 #the ratio between expected unit returns from rain fed crops and outside wages
 # aCr=2 #Multiplier for both profit and water use for high value crops.
 # 
 # #Advanced settings:
 # #Optimal Fields allocation per player for surface water.
 # QNS=4 #Nash (selfish)
 # QFS=3 #First best (community)
 # #Optimal Field allocation per player for groundwater
 # QNG0=5  #Myopic Nash (period 1)
 # QNG=3 #Sustainable Nash
 # QFG=2 #Sustainable first best
 # aF = 1 #profit from leaving one marginal field fallow
 # EPR= 3 #Expected groundwater recharge
 # k=1.75 #Recession constant per period.
 # lambda = 0.9 #the ratio of maximum losses to expected recharge; describes relative water level at steady state; 1 = completely full at steady state
 # #higher k and lambda increases max depth and the depth cost coefficient betaG, independently of expected recharge
 # aPen=0.50 #percentage of the profit if all fields were fallow 
 # Pen = aPen*9*aF #Lump sum profit penalty per person per bit for added public information
   #################  #################  #################  #################  #################  #################  #################  #################
  
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
  if(rhoRe>1) stop('The multiplier should be higher in a good year than a bad year')
  if(aCr<1) stop('High value crops should be more profitable than low value crops')
  
  #warnings:
  if(rhoRS>=1) warning('Surface water should be more profitable than rain water')
  if(rhoRG>=1) warning('Groundwater should be more profitable than rain water')
  if(rhoRS<rhoRG) warning('Value of irrigation types should be GW > SW > RW')
  if(rhoRF<=1) warning('Expected profit from rain fed crops should be higher than fallow')
  if(rhoRF>=1.5) warning('Rain fed crops should be less profitable than fallow in a bad year') 
  if(QNG==4) warning('SW profits become negative before GW')
  if(dP>(1-P)/10) warning('The probability of a good year will be 1 in 10 years')
  if(dP<(-(1-P)/10)) warning('The probability of a bad year will be 1 in 10 years')
  if(Ld>=5) warning('With P=0.5, there is a high probability (>80% for P00 and P11) that the rain year will get stuck as bad or good')
  if(dLd>(5-Ld)/3) warning('With P=0.5, The probability that the rain year will get stuck as bad or good increases past 80% (for P00 and P11) after only 3 years with this dLd')
  if(lambda<(1/k)) warning('If lambda < (1/k), the maximum depth, dm, will be smaller than the expected recharge, EPR')
  
  ##########   Rainfall year  ##########
  # Rain is a binary markov chain.
  #For rain: 1 = dry/bad year, 2 = wet/good year
  #P01 and P11 equations from (Muller & Thompson, 2013) https://doi.org/10.1016/j.advwatres.2013.08.004
  P=min(c(max(c(1e-6,P+dP)),1-1e-6))
  Ld=max(c(1,Ld+dLd))
  P1=P
  P01 = 1/Ld #prob of going from a dry year to wet year
  P11 = 1 + P01 - (P01/P1) #prob of going from a wet year to a wet year
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
  r1 = EPR / (P+rhoRe - (rhoRe*P)) #recharge amount for a good year
  r2 = rhoRe*(EPR / (P+rhoRe - (rhoRe*P))) #recharge amount for a bad year
  
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
      if(dm>=GD[i]){
        dd[i] = (bG1/bG)*q[i] + (bG2/bG)*sum(q[-i]) - re + ((dm-GD[i])/k) #change in depth, positive change if increasing depth
      }else{
        dd[i] = (bG1/bG)*q[i] + (bG2/bG)*sum(q[-i]) - re #If GD>dm, there will be no environmental outflow, will update d after calculating cost
      }
      d[i] = GD[i] + dd[i] #new depth 
      
      if(sum(d<0)>0) warning('New depth is negative')
      d[which(d<0)]<-0
      
      #profit, depends on antecedent d and current pumping (vector, q)
      uG[i] = ((aG-(bG*d[i]))*q[i] - q[i]*(q[i]*bG1+(sum(q[-i])*bG2)))
      #Total Pumping costs 
      uC_G[i] = (bG*d[i]*q[i]) + q[i]*(q[i]*bG1 + (sum(q[-i])*bG2)) }
      
      if(dm<GD[i]) warning('d>dm: New depth larger than max depth')
      d[which(d>dm)]<-dm #cannot have a depth larger than the max depth 
      
    return(list(uG=round(uG,2), d=d, uC_G = round(uC_G)))} #groundwater profits, new groundwater depth, and groundwater unit cost
  
  #################  #################  #################  #################  #################  #################  #################  #################
  ### Plot the utility functions and chosen optimal values
  if (generateGraph) {
    Gprof = vector()
    Sprof = vector()
    RGprof = vector()
    RBprof = vector()
    RAprof = vector()
    Fprof = vector()
    qPlot=0:7 #abstractions of each player

    rrr=rain
    for (i in qPlot){ #the mean profit will be the profit all players receive bc using same econ conditions
      qs=rep(i,N)  #vector with every player (6 total) taking the same GW

      ds = k*(psi1*i + psi2*(N-1)*i - EPR) + dm #vector of depths required for sustainable pumping
      if (ds<0) {ds=0}
      if (ds<0) warning('negative ds')
      
      Gprof[i+1] = i*(aG-bG*ds) - (i^2)*bG1 - i*bG2*(N-1)*i
      
      Sprof[i+1] = mean(uS(qs)$uS) #surface water profit
      RAprof[i+1] = i*(aR1*P+(1-P)*aR2) #expected rain profit
      Fprof[i+1] = i*aF
      
      rain=2 #good year
      RGprof[i+1] = mean(uR(qs)$uR) #rainfed profit good year

      rain=1 #bad year
      RBprof[i+1] = mean(uR(qs)$uR) #rainfed profit bad year
    }
    rain=rrr

    ggplot(data.frame(Village_Q = qPlot, Profit=Gprof, SW_Profit = Sprof, RGp = RGprof, RBp = RBprof, Fprof = Fprof), aes(x=Village_Q))+
      geom_line(aes(y=Profit), color='brown')+            #GW sustainable expected profit
      geom_line(aes(y=SW_Profit), color='blue')+          #SW profit
      geom_line(aes(y=RGp), color='green')+               #RW good year profit
      geom_line(aes(y=RBp), color='darkgreen')+           #RW bad year profit
      geom_line(aes(y=RAprof), color='darkgreen', lty=3)+ #RW expected profit
      geom_line(aes(y=Fprof), color='black')+             #Fallow profit
      geom_vline(xintercept=c(QNG,QFG,QNS,QFS),col=c('brown','brown', 'blue','blue'),lty=rep(c(1,2,1,2)))
    
    file_path = sprintf("/var/media/graph_imgs/%s_optimal_profits.jpeg", gameLabel)
    ggsave(file_path)
    return(list(file_path)) 
    #LEGEND:
    #BROWN - GW profit
    #BLUE - SW profit
    #LIME GREEN - RW good year profit
    #DARK GREEN - RW bad year profit
    #GREEN DOTS - RW expected profit
    #BLACK - Fallow profit
    #NASH OPTIMAL - dotted
    #FIRST BEST OPTIMAL - solid
  }

  #################  #################  #################  #################  #################  #################  #################  #################
  # Find the players' profits!
  
  ######## Non Irrigated Fields  ######## 
  
  #Rain fed
  Ri = data.frame(Ri=rowSums(1*Wa==3), RiCr=rowSums((aCr*Cr+!Cr)*(Wa==3))) #Number rain fields
  P_R = uR(Ri[[2]])$uR
  ERP = aR1*P + aR2*(1-P) #expected rain profits 
  RW = data.frame(Ri, ERP, round(P_R,2))
  names(RW)=c('Ri','RiCr','E[uB_R]','P_R')
  
  #Fallow
  Fi = data.frame(Fi=rowSums(1*(Wa==0)), uB_F=aF)%>%
    mutate(P_F=Fi*aF)  #number of fallow fields & fallow profits
  P_F = Fi[[1]]*aF #Fallow profit vector exists within Fi data frame and on its own
  
  ######## Irrigated Fields  ######## 
  
  ##### Groundwater ##### 
  #Individual data 
  Gi = data.frame(Gi=rowSums(1*(Wa==1)),GiCr=rowSums((aCr*Cr+!Cr)*(Wa==1))) #Extract groundwater fields from action matrix
  
  #sustainable GW profits equation per player
  Gfun = uG(Gi[[2]],GD)
  P_G = Gfun$uG
  d_new = Gfun$d
  uC_G=Gfun$uC_G
  GW = data.frame(Gi, uB_G = round(aG,2), uC_G, P_G)
  
  ##### Surface Water ##### 
  Si = data.frame(Si=rowSums(1*(Wa==2)),SiCr=rowSums((aCr*Cr+!Cr)*(Wa==2)))
  
  #Surface water profits equation per player
  Sfun = uS(Si[[2]])
  P_S = Sfun$uS
  uC_S=Sfun$uC_S
  SW = data.frame(Si, uB_S = round(aS,2), uC_S, P_S)
  
  #################  #################  #################  #################  #################  #################  #################  #################
  
  ##### Institutions and penalties #####
  #This information is bought by players in order to check that rules/institutions are being followed 
  Pen_C = Pen*sum(IB) #number of information bits purchased for the village #total cost of information bits purchased
  
  ########Gather important info: player decisions, profits, penalties, net profit
  df = RW%>%bind_cols(Fi)%>%bind_cols(SW)%>%bind_cols(GW)%>%mutate(P_Tot=P_R+P_F+P_S+P_G)%>%mutate(Penalty=rep(Pen_C,N))%>%mutate(P_Net=P_Tot-Pen_C)
  
  
  #################  #################  #################  #################  #################  #################  #################  #################
  ##### Exclude BOTS from the information bits #####

  HumanIndex = which((IsHumanPlayer == 1)) #Use the human index to select the rows of human players 
  Nhuman = length(HumanIndex)
    
  #Village data
  Gv=round(sum(Gi[HumanIndex,1])/Nhuman, 2) #Average number of fields irrigated with GW per player not accounting for high value crops
  Sv=round(sum(Si[HumanIndex,1])/Nhuman, 2) #Average number of fields irrigated with SW per player not accounting for high value crops
  Rv = round(sum(Ri[HumanIndex,1])/Nhuman, 2) ##Average number of fields irrigated with RW per player
  Fv = round(sum(Fi[HumanIndex,1])/Nhuman, 2) #Average number of fields left fallow per player
  
  HighCr = Cr #We want a matrix where 1 = high value crop and 0 = anything else
  HighCr[HighCr==5]=0 #get rid of the 5's that represent fallow fields and make them 0 (which also represents low value crop fields)
  HVCr = round(sum(HighCr[HumanIndex,])/Nhuman,2) #the average number of high value crops per player 
  
  
  #For the maximums, if multiple players have the same values, choose a random maximum/player 
  maxidx_prof = which(df$P_Net[HumanIndex] == max(df$P_Net[HumanIndex]))
  if (length(maxidx_prof)>1)
    {MaxProfPlayer=sample(maxidx_prof,1)} else {
    MaxProfPlayer=maxidx_prof}
  MaxProf = max(df$P_Net[HumanIndex])
  
  maxidx_GW = which(Gi[HumanIndex,2] == max(Gi[HumanIndex,2]))
  if (length(maxidx_GW)>1)
  {MaxGWPlayer=sample(maxidx_GW,1)}else {
    MaxGWPlayer=maxidx_GW}
  MaxGW = max(Gi[HumanIndex,2])
  
  maxidx_SW = which(Si[HumanIndex,2] == max(Si[HumanIndex,2]))
  if (length(maxidx_SW)>1)
  {MaxSWPlayer=sample(maxidx_SW,1)} else {
    MaxSWPlayer=maxidx_SW}
  MaxSW = max(Si[HumanIndex,2])
  
  HV_crops = rowSums(HighCr)
  maxidx_HV = which(HV_crops[HumanIndex] == max(HV_crops[HumanIndex]))
  if (length(maxidx_HV)>1)
  {MaxHVPlayer=sample(maxidx_HV,1)} else {
    MaxHVPlayer=maxidx_HV}
  MaxHV = max(HV_crops)
  
  #random player selection function
  randomplayer = function(q){
    q = cbind(q, 1:N) #store choices and player number
    players = q[HumanIndex,] #human players and their player numbers
    samp = sample(c(1:Nhuman), 1, F) #choose the random player
    usage = q[,1][samp] #find their usage
    number = q[,2][samp] #find their player number
  return(list(num=number, use=usage)) }
  #Select random players' information for this year
  GRand=randomplayer(Gi[[2]])
  SRand=randomplayer(Si[[2]])
  RRand=randomplayer(Ri[[2]])
  FRand=randomplayer(Fi[[1]])
  
  InfoBits = list(Gv, Sv, Rv, Fv, HVCr, ifelse((rain==2),round(P11,2),round(P01,2)), round(mean(uC_G[HumanIndex]),2), round(mean(uC_S[HumanIndex]),2), round(mean(df$P_Net[HumanIndex]),2), MaxProfPlayer, 
                        MaxProf, MaxGWPlayer, MaxGW, MaxSWPlayer, MaxSW, c(GRand$num, GRand$use),
                        c(SRand$num, SRand$use), c(RRand$num, RRand$use), c(FRand$num, FRand$use), MaxHVPlayer, MaxHV, EPR)
  
  #1. What was the average number of fields irrigated with groundwater per player this year in our village? (NOT accounting for high value crops)
  #2. What was the average number of fields irrigated with surface water per player this year in our village? (NOT accounting for high value crops)
  #3. What was the average number of fields irrigated with rain per player this year in our village? (NOT accounting for high value crops)
  #4. What was the average number of fields left fallow per player this year in our village?
  #5. How many high value crops were planted on average per player this year in our village?
  #6. What is the probability of next year being a good year given this years' rain type? 
  #7. What was the average unit groundwater cost over all players in the village this year? 
  #8. What was the average unit surface water cost over all players in the village this year?  
  #9. What was the average net profit for the village this year? 
  #10. Which player had the highest net profit this year?
  #11. What was the maximum net profit this year?
  #12. Which player used the most groundwater this year?
  #13. What is the maximum amount of groundwater used by a single player this year?
  #14. Which player used the most surface water this year?
  #15. What is the maximum amount of surface water used by a single player this year?
  #16. Randomly show a player's number and groundwater usage this year.
  #17. Randomly show a player's number and surface water usage this year.
  #18. Randomly show a player's number and rain water usage this year.
  #19. Randomly show a player's number and their number of fields left fallow this year.
  #20. Which player planted the most high value crops this year?
  #21. What was the maximum number of high value crops planted by a single player this year?
  #22. What is the expected average groundwater recharge amount? (constant value)
  
  
  names(InfoBits)=c('Avg. # GW Fields','Avg. # SW Fields','Avg. # RW Fields', 'Avg. # Fallow Fields', 'Avg. # High Value Crops', 'Prob. of Good Rain Next Year',
                    'Avg. GW Unit Cost','Avg. SW Unit Cost','Village Avg. Profit','Player w/ Max Profit', 'Max Village Profit', 'Player w/ Max GW use', 'Max Individual GW use',
                    'Player w/ Max SW use','Max Individual SW use', 'Random player/GW usage', 'Random player/SW usage', 'Random player/RW usage', 
                    'Random player/# fields Fallow', 'Player w/ Max High Value Crop', 'Max # High Value Crops', 'Expected GW Recharge') 
  
  #################  #################  #################  #################  #################  #################  #################  #################
  
  #######Public information for all players in the village
  Public = InfoBits[IB==1] #Information everyone in the village paid to see 
  
  #########Individual information to display to each player
  Public_const= data.frame(aF, round(aR1,2), round(aR2,2), round(aS,2), round(bS1,2), round(bS2,2), round(aG,2), round(bG,2), round(bG1,2), round(bG2,2), Pen)
  names(Public_const)=c('alphaF', 'alphaR1', 'alphaR2','alphaS','betaS1','betaS2','alphaG','betaG','betaG1','betaG2','Unit Penalty')
  #probability of a good rain year if this year was good, probability of a good rain year if this year was bad, fallow unit benefit, good rain unit benefit, 
    #bad rain unit benefit, unit SW benefit, SW cost parameters, unit GW benefit, GW cost parameters, 
    
  Private_notconst = cbind(df[4], df[7], df[12], df[17], df[20], round(d_new,2), rep(round(P11,2),N), rep(round(P01,2),N) )   #the profit for each type and net profits and the new depth for each player 
  names(Private_notconst)=c('Profit_R','Profit_F','Profit_S', 'Profit_G', 'Profit_Net', 'New GW Depth', 'Prob. Rain Good_Good', 'Prob. Rain Bad_Good')
  #rain profit, fallow profit, SW profit, GW profit, Net profits, and new GW depth PER PLAYER
  
  

  return(list(df, Public_const, Private_notconst, Public, rain, d_new)) 
  #display Public_const, Private_notconst, and Public to the appropriate players 
  #rain and d_new are inputs for the next round (r0 and GD)
  
}

