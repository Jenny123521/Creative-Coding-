var treeData,useData=[]
function easeOutQuart(x) {
	return 1 - pow(1 - x, 4);
}

function preload(){
  treeData = loadJSON("agrstatUnit.json")
}
let selElement,sliderElement
function setup() {
	treeData = Object.values(treeData)
	// print(treeData)
	
	let storedType = getItem("tree_type_select") || "相思樹"
	// print(storedType)
	selElement = createSelect()
	selElement.position(50,50)
	selElement.option("相思樹")
	selElement.option("針葉樹合計")
	selElement.option("一級木小計")
	selElement.option("扁柏")
	selElement.option("台灣杉")
	selElement.selected(storedType)
	selElement.changed(selectChanged)
	
	let storedScale =getItem("tree_scale")
	let resultScale = storedScale?storedScale.value:0.86
	sliderElement=createSlider(0.2,1,resultScale  ,0.001)
	sliderElement.position(50,100)
	
	sliderElement.changed(function(){
		storeItem("tree_scale",{
			value:	this.value()
		})
	})
	
	useData = treeData.filter(function(d){
		return d.dname1==storedType
	})
	
	
	createCanvas(windowWidth, windowHeight);
	background(100);
	drawingContext.shadowColor = color(0,30)
	drawingContext.shadowOffsetY = 20
	drawingContext.shadowOffsetX = 0
	
}

function selectChanged(){
	let selectedType = this.value()
	storeItem("tree_type_select",selectedType)
	
	print(selectedType)
	useData= []
	for(let d of treeData){
		if (d.dname1==selectedType){
			useData.push(d)
			print(d)
		}
	}
}

function draw() {
	background(28, 126, 214)//(15, 22, 66)
	push()
		fill(255)
		textSize(40)
		text(selElement.value()+"生產統計(民國)",50,height-50)
	  textSize(20)
		text("單位:立方公尺",50,height-20)
	pop()
	
	translate(width/2,height/2)
	noStroke()
	let stColor = color(158, 111, 31)
	let edColor = color(255, 212, 145)
	let stColor1 = color(24, 102, 23)
	let edColor1 = color(153, 249, 57)
	let animationProgress = easeOutQuart(map(frameCount,0,200,0,1,true))
	let animationProgress1 = easeOutQuart(map(frameCount,50,250,0,1,true))
	
	push()
		rotate(-PI/4)
		noFill()
	stroke(255,100)
	let powerNumber = sliderElement.value()
	for(var i =0;i<=5;i++){
		let h = map(pow(i*2000,powerNumber),0,8000,0,-height)* animationProgress
		
		ellipse(0,0,h*2-100)
		push()
			fill(255)	
			text(i*2000,0,h-50)
		pop()
	}
	pop()
	
	for(var i=0;i<useData.length;i+=2){
		let animationProgress2 = easeOutQuart(map(frameCount-i*5,50,250,0,1,true))
	
		let d = useData[i]
		let ratio = map(d.value,0,12000,0,1)* animationProgress2
		let midColor = lerpColor(stColor,edColor,ratio)
		let midColor1 = lerpColor(stColor1,edColor1,ratio)
		
		fill(midColor)
		push()
			rotate(i*(2*PI/(useData.length+5)))
			translate(0,-50)
			let h = map(pow(d.value,powerNumber),0,8000,0,-height)* animationProgress
			rect(0,0,12*animationProgress2,h)
			
			fill(midColor1)
			ellipse(0,h-20*ratio,120*ratio)
			ellipse(-30*ratio,h-10*ratio,120*ratio)
		  ellipse(45*ratio,h-5*ratio,90*ratio)
		  ellipse(-45*ratio,h-5*ratio,90*ratio)
			ellipse(30*ratio,h+15*ratio,90*ratio)
		  
		
			rotate(-PI/2)
			fill(255)
			textSize(16)
			text(d.date+"年",10,-5)
		pop()
	}

}





