class meeple{
    constructor(x,y,com,hom){
        this.infected = false
        this.coord = new createVector(x,y)
        this.home = hom
        this.commun = com
        this.sus = Math.random()*4500
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
        if(this.sus<=this.time){
            this.dead=true
            dead++
        }
        this.time++
        if(this.time>this.effectedTime){
            this.time=0
            this.effectedTime = 0
            this.infected=false
        }
    }
}
class town{
    constructor(xb,yb,w,h,amountOfMeeple){
        this.startB = new createVector(xb,yb)
        this.dimention = new createVector(w,h)
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
            this.meepleList.push(new meeple(x,y,Math.round(Math.random()*3),Math.floor(i/5)))
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
    }
    spread(num){
        for(let i =0;i<this.meepleList.length;i++){
            let disx = this.meepleList[num].coord.x-this.meepleList[i].coord.x
            let disy = this.meepleList[num].coord.y-this.meepleList[i].coord.y
            let dis = Math.sqrt(Math.pow(disx,2)+Math.pow(disy,2))
            if(dis<20){
                let chance = Math.random()
                if(chance>0.75){this.meepleList[i].infected=true}
            }
        }
    }
}
let country = []
let time =500
let type =1
let trav = true
let qua = false
let noGath = false
let dead = 0
let maxDead = 1
let totDead = [0]
function setup(){
    createCanvas(2420,3240)
    let cb1 = createCheckbox('Cancel work/school', false)
    cb1.changed(function(){noGath=!(noGath)})
    let cb2 = createCheckbox('Quarintine at home', false)
    cb2.changed(function(){qua=!(qua)})
    let cb3 = createCheckbox('Stop travel between towns', false)
    cb3.changed(function(){trav=!(trav)})
    for(let i =0;i<60;i++){
        country.push(new town(((i%6)*310)+20,310*Math.floor(i/6),300,300,100))
    }
    country[0].meepleList[0].infected=true
}
function draw(){
    background(255)
    fill(color(255,0,0))
    rect(200,200,100,100)
    for(let i =0;i<country.length;i++){
        country[i].show()
    }
    for(let i =0;i<country.length;i++){
        country[i].showMeep(type)
    }
    time-=1
    if(time==0){
        totDead.push(dead)
        if(dead>maxDead){maxDead=dead}
        graph()
        dead=0
        time =500
        type=Math.round(Math.random()*2)
        if(qua){type=0}
        if(type==1 && noGath){type = 2}
    }
    if(trav){
        let thing = true
        let from
        while(thing){
            thing = false
            from = Math.floor(Math.random()*country.length)
            if(country[from].meepleList.length==0){
                thing=true
            }
        }
        let to = Math.floor(Math.random()*country.length)
        let touristNum = Math.floor(country[from].meepleList.length*Math.random())
        let tourist = country[from].meepleList[touristNum]
        country[from].meepleList.splice(touristNum,1)
        country[to].meepleList.push(tourist)
    }
    graph()
}
function graph(){
    fill(color(255,255,255))
    rect(1875,950,425,425)
    rect(1875,475,425,425)
    rect(1875,0,425,425)
    push()
    strokeWeight(2)
    beginShape()
    stroke(color(0,0,0))
    for(let i =0;i<totDead.length;i++){
        vertex(1875+(i*425/totDead.length),425-(totDead[i]*425/maxDead))
    }
    endShape()
    beginShape()
    stroke(color(0,0,0))
    let allD = [0]
    for(let i =1;i<totDead.length;i++){allD.push(allD[i-1]+totDead[i])}
    for(let i =0;i<allD.length;i++){
        vertex(1875+(i*425/allD.length),900-(allD[i]*425/allD[allD.length-1]))
    }
    endShape()
    beginShape()
    stroke(color(0,0,0))
    for(let i =0;i<allD.length;i++){
        vertex(1875+(i*425/allD.length),1375-((6000-allD[i])*425/6000))
    }
    endShape()
    pop()
}
