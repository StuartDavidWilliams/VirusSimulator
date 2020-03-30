class meeple{//ITS NOT THE BEST CODE BUT GIVE ME A BREAK
    constructor(x,y,com,hom,suss,immun){
        this.infected = false
        this.coord = new createVector(x,y)
        this.home = hom
        this.immun = immun
        this.commun = com
        this.sus
        let num=Math.random()*99
        if(num<suss){this.sus = true}
        this.dead = false
        this.time=0
        this.effectedTime = Math.random()*4000
    }
    show(){
        fill(color(255,255,255))
        if(this.infected){fill(color(255,0,0))}
        if(this.effectedTime==0){fill(color(0,0,0))}
        ellipse(this.coord.x,this.coord.y,10)
    }
    run(sxb,exb,syb,eyb){
        this.coord.x +=(Math.random()*10)-5
        this.coord.y +=(Math.random()*10)-5
        if(this.coord.x<sxb){this.coord.x+=5}
        if(this.coord.y<syb){this.coord.y+=5}
        if(this.coord.x>exb){this.coord.x-=5}
        if(this.coord.y>eyb){this.coord.y-=5}
        if(this.infected){this.carrying()}
    }
    carrying(){
        this.time++
        if(this.effectedTime<this.time){
            if(this.sus){
                this.dead = true
            }else{
                this.infected = false
            }
            if(this.immun){this.effectedTime=0}
        }
    }
}
class town{
    constructor(xb,yb,w,h,amountOfMeeple,radi,sus,immun){
        this.startB = new createVector(xb,yb)
        this.dimention = new createVector(w,h)
        this.rad = radi
        this.commun = []
        this.homes=[]
        for(let i =0;i<4;i++){
            let x = ((this.dimention.x-30)*Math.random())+xb
            let y = ((this.dimention.y-30)*Math.random())+yb
            this.commun.push(new createVector(x,y))
        }
        for(let i =0;i<20;i++){
            let x = ((this.dimention.x-20)*Math.random())+xb
            let y = ((this.dimention.y-20)*Math.random())+yb
            this.homes.push(new createVector(x,y))
        }
        this.meepleList = []
        for(let i= 0;i<amountOfMeeple;i++){
            let x = (this.dimention.x*Math.random())+xb
            let y = (this.dimention.y*Math.random())+yb
            this.meepleList.push(new meeple(x,y,Math.round(Math.random()*3),Math.floor(i/5),sus,immun))
        }
    }
    play(){
        for(let i = 0;i<this.meepleList.length;i++){
            this.meepleList[i].run(this.startB.x,this.startB.x+this.dimention.x,this.startB.y,this.startB.y+this.dimention.y)
        }
    }
    work(){
        for(let i = 0;i<this.meepleList.length;i++){
            this.meepleList[i].run(this.commun[this.meepleList[i].commun].x,this.commun[this.meepleList[i].commun].x+30,this.commun[this.meepleList[i].commun].y,this.commun[this.meepleList[i].commun].y+30)
        }
    }
    housing(){
        for(let i = 0;i<this.meepleList.length;i++){
            this.meepleList[i].run(this.homes[this.meepleList[i].home].x,this.homes[this.meepleList[i].home].x+20,this.homes[this.meepleList[i].home].y,this.homes[this.meepleList[i].home].y+20)
        }
    }
    show(){
        fill(color(0,255,0))
        rect(this.startB.x,this.startB.y,this.dimention.x,this.dimention.y)
        fill(color(0,0,255))
        for(let i =0;i<this.commun.length;i++){
            rect(this.commun[i].x,this.commun[i].y,30,30)
        }
        fill(color(255,150,0))
        for(let i =0;i<this.homes.length;i++){
            rect(this.homes[i].x,this.homes[i].y,20,20)
        }
    }
    showMeep(act){
        if(act==0){
            this.housing()
        }
        if(act==1){
            this.work()
        }
        if(act==2){
            this.play()
        }
        let remove =[]
        for(let i = 0;i<this.meepleList.length;i++){
            this.meepleList[i].show()
            if(this.meepleList[i].dead){
                remove.push(i)
            }
        }
        for(let i =0;i<remove.length;i++){
            this.meepleList.splice(remove[i]-i,1)
        }
        for(let i =0;i<this.meepleList.length;i++){
            if(this.meepleList[i].infected){this.spread(i)}
        }
        return(remove.length)
    }
    spread(num){
        for(let i =0;i<this.meepleList.length;i++){
            let disx = this.meepleList[num].coord.x-this.meepleList[i].coord.x
            let disy = this.meepleList[num].coord.y-this.meepleList[i].coord.y
            let dis = Math.sqrt(Math.pow(disx,2)+Math.pow(disy,2))
            if(dis<this.rad){
                let chance = Math.random()
                if(chance>0.75){this.meepleList[i].infected=true}
            }
        }
    }
}
class sim{
    constructor(amount,popuu,chance,radi,im){
        this.country = []
        this.time =500
        this.type =1
        this.dead =0
        this.popu = popuu
        this.amm = amount
        this.maxDead = 1
        this.totDead = [0]
        createCanvas(2420,320*(Math.ceil(amount/6)))
        let cb1 = createCheckbox('Cancel work/school', false)
        cb1.changed(function(){noGath=!(noGath)})
        let cb2 = createCheckbox('Quarintine at home', false)
        cb2.changed(function(){qua=!(qua)})
        let cb3 = createCheckbox('Stop travel between towns', false)
        cb3.changed(function(){trav=!(trav)})
        for(let i =0;i<amount;i++){
            this.country.push(new town(((i%6)*310)+20,310*Math.floor(i/6),300,300,popuu,radi,chance,im))
        }
        this.country[0].meepleList[0].infected=true
    }
    tick(){
        background(255)
        fill(color(255,0,0))
        rect(200,200,100,100)
        for(let i =0;i<this.country.length;i++){
            this.country[i].show()
        }
        for(let i =0;i<this.country.length;i++){
            this.dead+=this.country[i].showMeep(this.type)
        }
        this.time-=1
        if(this.time==0){
            this.nextWeek()
        }
        if(trav){
            this.travell()
        }
        fill(color(0,0,0))
        text(("Next week in: ").concat(this.time),10,height-50)
        text(("Week number: ").concat(this.totDead.length),10,height-30)
        this.graph()
    }
    nextWeek(){
        this.totDead.push(this.dead)
        if(this.dead>this.maxDead){this.maxDead=this.dead}
        this.dead=0
        this.time =500
        this.type=Math.round(Math.random()*2)
        if(qua){this.type=0}
        if(this.type==1 && noGath){this.type = 2}
    }
    travell(){
            let from= Math.floor(Math.random()*this.country.length)
            if(this.country[from].meepleList.length!=0){
                let to = Math.floor(Math.random()*this.country.length)
                let touristNum = Math.floor(this.country[from].meepleList.length*Math.random())
                let tourist = this.country[from].meepleList[touristNum]
                this.country[from].meepleList.splice(touristNum,1)
                this.country[to].meepleList.push(tourist)
            }
    }
    graph(){
        fill(color(255,255,255))
        rect(1875,950,425,425)
        rect(1875,475,425,425)
        rect(1875,0,425,425)
        fill(color(0,0,0))
        text("TIME",2080,440)
        text("TIME",2080,915)
        text("TIME",2080,1390)
        text("Death per week",1885,20)
        text("Total deaths",1885,495)
        text("Living",1885,1360)
        text(this.maxDead,2310,10)
        push()
        noFill()
        strokeWeight(2)
        beginShape()
        stroke(color(0,0,0))
        for(let i =0;i<this.totDead.length;i++){
            vertex(1875+(i*425/this.totDead.length),425-(this.totDead[i]*425/this.maxDead))
        }
        endShape()
        beginShape()
        stroke(color(0,0,0))
        let allD = [0]
        for(let i =1;i<this.totDead.length;i++){allD.push(allD[i-1]+this.totDead[i])}
        for(let i =0;i<allD.length;i++){
            vertex(1875+(i*425/allD.length),900-(allD[i]*425/allD[allD.length-1]))
        }
        endShape()
        beginShape()
        stroke(color(0,0,0))
        for(let i =0;i<allD.length;i++){
            vertex(1875+(i*425/allD.length),1375-(((this.amm * this.popu)-allD[i])*425/(this.amm * this.popu)))
        }
        endShape()
        pop()
        fill(color(0,0,0))
        text(allD[allD.length-1],2310,480)
        text((this.amm * this.popu),2310,960)
        text((this.amm * this.popu)-allD[allD.length-1],2310,1385-(((this.amm * this.popu)-allD[allD.length-1])*425/(this.amm * this.popu)))
    }
}
let theCountry//I KNOW ITS ALOT OF GLOBAL VARIABLES
let run = false//SORRY
let qua = false
let noGath = false
let trav = true
let amountSlider
let popSlider
let deathChance
let inRadi
let go
let recov
function setup(){
    createCanvas(screen.width,10)
    amountSlider = createSlider(30, 300, 60)
    popSlider= createSlider(50, 150, 100)
    deathChance = createSlider(1, 100, 50)
    inRadi= createSlider(0, 50, 20)
    recov = createCheckbox('Becomes immune after recovery', false)
    go = createButton("BEGIN SIMULATION")
    go.mousePressed(function(){
        theCountry = new sim(amountSlider.value(),popSlider.value(),deathChance.value(),inRadi.value(),recov.checked());
        run=true;
        go.hide();
        amountSlider.hide();
        popSlider.hide();
        deathChance.hide();
        inRadi.hide();
        recov.hide();
    })
}
function draw(){
    if(run){theCountry.tick()}else{
        background(255)
        text(("Amount of towns: ").concat(amountSlider.value()),5,10)
        text(("Population of towns: ").concat(popSlider.value()),125,10)
        text((("Chance of death: ").concat(deathChance.value())).concat("%"),275,10)
        text(("Infection radius: ").concat(inRadi.value()),400,10)
    }
}
