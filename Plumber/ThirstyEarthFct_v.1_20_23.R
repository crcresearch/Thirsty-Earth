################ Functions for water use and profit each year ############################################################
#Lauren McGiven & Marc Muller, January 2023
#Some material from Irrigania (Seibert & Vis, 2012): https://doi.org/10.5194/hess-16-2523-2012
#Some material from (Hoekstra, 2012): https://doi.org/10.5194/hess-16-2985-2012

#This function is applied individually for a single village. There will be no upstream or downstream villages.
#rm(list=ls())
library(tidyverse)
# library(stringr)
# library(vctrs, lib='~/myRlibs')
# > characterVector = '123645789654125896'
# > matrixResult =  matrix(as.numeric(str_split_1(characterVector,"")), ncol=9, byrow=TRUE)
# > print(matrixResult)

#* @filter cors
cors <- function(res) {
    res$setHeader("Access-Control-Allow-Origin", "*")
    plumber::forward()
}

#######################################################################################################################################################################################
#* Return the  of two numbers
#* @param Wa:string matrix of individual choice per field (here nine fields and six players). 0,1,2,3 indicate fallow, groundwater, surface water and rain
#* @param Cr:string crop type per field per player
#* @param IB:[int] binary vector indicating which information bits to purchase
#* @param GD:number Starting GW depth from previous year
#* @param r0:int rain value of previous year
#* @param P:number prob of wet/good year
#* @param Ld:number average length of dry spell (also passed as argument)
#* @param dP:number annual increase in annual probability of wet year
#* @param dLd:number annual increase in average length of dry spell
#* @param QFS:number First best (community)
#* @param QNS:number Nash (selfish)
#* @param QNG:number Sustainable Nash
#* @param QFG:number Sustainable first best
#* @param rhoRF:number the ratio between expected unit returns from rain fed crops and outside wages 
#* @param rhoRS:number for surface water
#* @param rhoRG:number for groundwater
#* @param rhoR:number Multiplier for profit (and recharge) for normal crops for bad vs good rain year. 
#* @param aF:number profit from leaving one marginal field fallow 
#* @param EPR:number Expected groundwater recharge
#* @param k:number Recession constant per period.
#* @param aCr:number Multiplier for both profit and water use for high value crops.
#* @param psi:number average effect of all farmers on any farmer’s drawdown #takes value of 1 in Siebert et al 2014
#* @post /calculate
function(Wa,Cr,IB,GD=0,r0=1,P=0.5,Ld=1,dP=0,dLd=0,QFS=3,QNS=4,QNG=4,QFG=3,rhoRF=1.3,rhoRS=0.7,rhoRG=0.45,rhoR=0.5,aF=1,EPR=2,k=1.25,aCr=2,psi=1){
  
  #Test function with fake arguments:
  #Play Parameters passed as argument
  Wa = matrix(as.numeric(str_split_1(Wa,"")), ncol=9, byrow=TRUE)
  # Wa=matrix(sample(c(0,1,2,3),(54),T),ncol=9) #matrix of individual choice per field (here nine fields and six players). 0,1,2,3 indicate fallow, groundwater, surface water and rain
  # Cr=matrix(sample(c(0,1),54,T),ncol=9) #crop type per field per player
  Cr = matrix(as.numeric(str_split_1(Cr,"")), ncol=9, byrow=TRUE)
  IB = sample(c(1,0), 6, replace = T, prob = c(.35,.65)) #binary vector indicating which information bits to purchase
  # IB = matrix(as.numeric(str_split_1(IB,"")), ncol=9, byrow=TRUE)

  
  #Test function with everyone taking the optimal amounts!
  # Wa=rbind(c(1,0,1,2,2,2,3,3,3),c(1,1,1,2,2,2,3,3,3),c(1,1,1,2,2,2,3,3,3),c(1,1,1,2,2,2,3,3,3),c(1,1,1,2,2,2,3,3,3),c(1,1,1,2,2,2,3,3,3)) 
  #3 groundwater fields, 3 surface water fields, 3 rain fields (fallow might be better if bad year)
  # Cr=matrix(0,nrow=6,ncol=9) #all low value crops to see how it goes 
  
  
  ### INITIALIZATION (Parameters passed as argument)
  # GD=0 #Starting GW depth from previous year
  GD = as.integer(GD)
  # r0=1 #rain value of previous year
  r0=as.integer(r0) #rain value of previous year
  
  #Checks
  if(max(Wa)>3) stop('Wa must be between 0 and 3')
  if(nrow(Wa)!=nrow(Cr)) stop('Wa and Cr must have the same number of players (rows)')
  if(ncol(Wa)!=ncol(Cr)) stop('Wa and Cr must have the same number of fields (columns)')
  
  #################  #################  #################  #################  #################  #################  #################  #################
  
  #FREE CLIMATE PARAMETERS
  # Parameters for rain (by default, 50% probability of good year and no autocorrelation)
  # P=0.5 #prob of wet/good year (also passed as argument)
  P = as.numeric(P)
  # Ld=1 #average length of dry spell (also passed as argument)
  Ld = as.numeric(Ld)
  #Climate change
  # dP=0 #annual increase in annual probability of wet year
  dP = as.numeric(dP)
  # dLd=0 # annual increase in average length of dry spell
  dLd= as.numeric(dLd)
  
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
  
  #FREE ECON PARAMETERS
  Pen=1 #Profit penalty per person for added public information (lump sum per bit).
  #Optimal Fields allocation per player for surface water. 
  # QNS=4 #Nash (selfish)
  QNS = as.numeric(QNS)
  # QFS=3 #First best (community)
  QFS = as.numeric(QFS)
  #Optimal Field allocation per player for groundwater
  QNG0=5  #Myopic Nash (period 1)
  # QNG0 = as.numeric(QNG0)
  QFG0=4 #Myopic First Best
  # QFG0 = as.numeric(QFG0)
  # QNG=4 #Sustainable Nash
  QNG = as.numeric(QNG)
  # QFG=3 #Sustainable first best
  QFG = as.numeric(QFG)
  #Ratio of Utility for rain vs irrigation
  # rhoRS=0.7 #for surface water
  rhoRS = as.numeric(rhoRS)
  # rhoRG=0.45 #for groundwater
  rhoRG = as.numeric(rhoRG)
  #Misc free parameters
  # aF = 1 #profit from leaving one marginal field fallow 
  aF = as.numeric(aF)
  # EPR=2 #Expected groundwater recharge
  EPR = as.numeric(EPR)
  # k=1.25 #Recession constant per period.
  k = as.numeric(k)
  # aCr=2 #Multiplier for both profit and water use for high value crops.
  aCr = as.numeric(aCr)
  # rhoR=0.5 #Multiplier for profit (and recharge) for normal crops for bad vs good rain year. 
  rhoR=as.numeric(rhoR)
  # rhoRF = 1.3 #the ratio between expected unit returns from rain fed crops and outside wages 
  rhoRF = as.numeric(rhoRF)
  # psi = 1 #average effect of all farmers on any farmer’s drawdown #takes value of 1 in Siebert et al 2014
  psi = as.numeric(psi)
  
  #Checks
  if(QFS>QNS) stop('QNS should not be larger than QFS')
  if(QNG>QNG0) stop('QNG should not be larger than QNG0')
  if(QFG>QFG0) stop('QFG should not be larger than QFG0')
  if(QFG0>QNG0) stop('QFG0 should not be larger than QNG0')
  if(QFG>QNG) stop('QFG should not be larger than QNG')
  if(QNG0==2*QFG0) stop('QNG0 cannot be 2x larger than QFG0 because math')
  if(QNS==2*QFS) stop('QNS cannot be 2x larger than QFS because math')
  if(2*QFG0 < QNG0) stop('2*QFG0 cannot be smaller than QNG0 because math')
  if(2*QFS < QNS) stop('2*QFS cannot be smaller than QNS because math')
  
  
  #DERIVED PARAMETERS 
  N=nrow(Wa) #number of players
  
  #R
  aR1 = (aF*rhoRF)/(P+rhoR-(P*rhoR)) #unit profit per field in a good year
  aR2 = (aF*rhoRF)/(P+rhoR-(P*rhoR))*rhoR #unit profit per field in a bad year
  
  #SW
  R1 = (1/QNS)-(1/(2*QFS)) #should be larger than 0 
  R2 = (2*(QNS-QFS)) / ((N-1)*((2*QFS)-QNS)) #should be within [0,1]
  aS = ((aF*rhoRF)/rhoRS)*(1/(1-R1-(R1*R2*(N-1)))) #unit benefit from surface water
  bS1 = aS*R1 #multiplier for cost of own consumption
  bS2 = aS*R1*R2 #multiplier for cost of other farmers' consumption

  #GW
  R3 = (1/QNG0)-(1/(2*QFG0)) #should be larger than 0
  R4 = (2*(QNG0-QFG0))/((N-1)*((2*QFG0)-QNG0)) #should be within [0,1]
  aG = ((aF*rhoRF)/rhoRG)*(1/(1-R3-(R3*R4*(N-1)))) #unit benefit per GW irrigated field 
  bG1 = aG*R3 #multiplier for cost of own consumption
  bG2 = aG*R3*R4 #multiplier for cost of other farmers' consumption
  
  #wolfram alpha result for R5
  R5 = (((-2*R3*QFG*N)+(2*R4*QFG)+(R4*QNG*N)-(R4*QNG)-(2*QFG)+(2*QNG))/((2*QFG*k*N*psi)-(k*QNG*N*psi)))
  R6 = (k*N*psi*(((2*QFG)*((R3*QNG)-1)) + QNG))/ (R3*((2*QFG*((R4*(N-1))+1)) + (QNG*(R4*(-N) + R4 - 2))))
  
  #The original paper equations 
  #R5 = (1/(k*psi*N))*(((2*QFG*((R4*(N-1))+1))-(QNG*((R4*(N-1))+2)))/(QNG-QFG)) ###NEGATIVE (?)
  #R6 = (k*psi*N)*(((R4*(N-1)*QFG*QNG)+((1/R3)*(QNG-QFG)))/((2*QFG*((R4*(N-1))+1))-(QNG*((R4*(N-1))+2))))
  
  bG = bG1*R5
  dm = R6+(k*EPR) #depth to bottom of aquifer
  r1 = EPR / (P+rhoR - (rhoR*P)) #recharge amount for a good year
  r2 = rhoR*(EPR / (P+rhoR - (rhoR*P))) #recharge amount for a bad year
  
  
  #NON NEGATIVITY AND OTHER BOUNDS CONDITIONS on all parameters:
  if(R2<0 | R2>1) stop('R2 must be between 0 and 1')
  if(R4<0 | R4>1) stop('R4 must be between 0 and 1')
  if(R1<0) stop('R1 must be positive')
  if(R3<0) stop('R3 must be positive')
  if(R4<0) stop('R4 must be positive')
  if(R5<0) stop('R5 must be positive')
  if(R6<0) stop('R6 must be positive')
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

  
  #################  #################  #################  #################  #################  #################  #################  #################
  
  #Plot profit functions
  uR=function(q) return(q*(aR1*P+(1-P)*aR2)) #rain utility function per player
  
  uS=function(q){
    uS = vector()
    for (i in 1:length(q)){ uS[i] = (aS*q[i]-q[i]*(q[i]*bS1+sum(q[-i])*bS2)) } #round( , 2)
    
    return(round(uS,2)) #surface water utility function per player, q is a vector
  }
  
  uG0=function(q){
    uG0 = vector()
    for (i in 1:length(q)){ uG0[i] = (aG*q[i]-q[i]*(q[i]*bG1+sum(q[-i])*bG2)) } #round( , 2)
    return(uG0) #myopic groundwater utility function per player, q is a vector
  }
  
  uG=function(q){
    dd = vector()
    uG = vector()
    d = vector()
  
    if (rain==2) {
      re = r1 #good year recharge
    } else if (rain == 1) {
      re = r2 } #bad year recharge
    
    for (i in 1:length(q)){
      dd[i] = (bG1/bG)*q[i] + (bG2/bG)*sum(q[-i]) - re + ((dm-GD)/k) #change in depth
      d[i] = GD + dd[i] #new depth 
      
      uG[i] = ((aG-bG*d[i])*q[i] - q[i]*(q[i]*bG1+sum(q[-i])*bG2)) }
    
    return(list(uG=round(uG,2), d=d))} #sustainable groundwater utility function per player and new groundwater depth
  
  
#Plot the utility functions and chosen optimal values 
  
  # g=ggplot(data.frame(x=1:10),aes(x))+
  #   geom_function(fun=uR,col="black")+
  #   geom_function(fun=uS,col="blue")+
  #   geom_function(fun=uG,col="red")+
  #   geom_function(fun=uG0,col="orange")+
  #   geom_vline(xintercept=c(QNS,QFS,QNG,QFG,QNG0,QFG0),col=c('blue','blue','red','red','orange','orange'),lty=rep(2:1,3))
    
  # print(g)
  
  # plot(x=(1:10), y=uG(1:10))
  
  #################  #################  #################  #################  #################  #################  #################  #################
  # Find the players' profits!
  
  ######## Non Irrigated Fields  ######## 
  
  Ri = data.frame(Ri=rowSums(1*Wa==3), RiCr=rowSums((aCr*Cr+!Cr)*(Wa==3))) #Number rain fields
  if (rain==2) {
      P_R = Ri[2]*aR1 #good year profit
    } else if (rain == 1) {
      P_R = Ri[2]*aR2 #bad year profit
    }
  Rv = sum(Ri[1])
  RW = data.frame(Ri, round(P_R,2))
  names(RW)=c('Ri','RiCr','P_R')
  
  Fi = data.frame(Fi=rowSums(1*(Wa==0)))%>%
    mutate(P_F=Fi*aF)  #number of fallow fields & fallow profits
  Fv = sum(Fi[1])
  
  ######## Irrigated Fields  ######## 
  
  ##### Groundwater ##### 
  #Individual data 
  Gi = data.frame(Gi=rowSums(1*(Wa==1)),GiCr=rowSums((aCr*Cr+!Cr)*(Wa==1))) #Extract groundwater fields from action matrix
  #Village data
  Gv=sum(Gi[1]) #total number of fields planted with groundwater not accounting for high value crops
  
  #sustainable GW profits equation per player
  Gfun = uG(unlist(Gi[2]))
  P_G = Gfun$uG
  d_new = Gfun$d
  
  GW = data.frame(Gi, P_G)
  
  ##### Surface Water ##### 
  Si = data.frame(Si=rowSums(1*(Wa==2)),SiCr=rowSums((aCr*Cr+!Cr)*(Wa==2)))
  Sv=sum(Si[1]) #total number of fields planted with surface water not accounting for high value crops

  #Surface water profits equation per player
  P_S = uS(unlist(Si[2]))
  
  SW = data.frame(Si, P_S)
  
  
  ##### Institutions and penalties #####
  #This information is bought by players in order to check that rules/institutions are being followed 
  
  Pen_C = Pen*sum(IB) #number of information bits purchased for the village #total cost of information bits purchased
  InfoBits = data.frame(Gv, Sv, Fv, Rv, sum(Cr), rain)
  #1. How many total fields irrigated with groundwater last year in our village?
  #2. How many total fields irrigated with surface water last year in our village?
  #3. How many total fields left fallow last year? 
  #4. How many total fields irrigated with rain water last year in our village?
  #5. How many high value crops were planted total last year?
  #6. Was last year a good or bad rain year?
  #7. 
  PubInfo = InfoBits[IB==1]
  
  #################  #################  #################  #################  #################  #################  #################  #################
  
  ########Gather important info: player decisions, profits, penalties, net profit
  df = RW%>%bind_cols(Fi)%>%bind_cols(SW)%>%bind_cols(GW)%>%mutate(P_Tot=Ri[2]+Fi[2]+P_S+P_G)%>%mutate(P_Net=P_Tot-Pen_C)
  #total profits use sustainable GW profits not myopic

  
  #########Individual information to display to each player
  Private=bind_cols(df[1],df[3],df[9],df[11],df[6],df[8],df[4],df[5],df[13])
  
  ########Public village level information to display to all players in each village.
  Public=data.frame(P_Avg = mean(df$P_Net), C_G=round(-((P_G/Gi[2])-aG),2)) #average village profit and cost per unit of groundwater
  ####This PUBLIC dataframe must be modified by the user!!
  

  return(list(Private,Public,PubInfo,rain))
  
}

##To DO
#Bots
