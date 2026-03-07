let correct=0
let total=0

function judge(cent){

total++

if(Math.abs(cent)<20){

correct++

}

updateScore()

}

function updateScore(){

let rate = Math.round((correct/total)*100)

document.getElementById("score").innerText =
"Pitch Accuracy: "+rate+"%"

}

function drawSheet(){

const {Renderer,Stave,StaveNote} = Vex.Flow

let div = document.getElementById("sheet")

let renderer = new Renderer(div,Renderer.Backends.SVG)

renderer.resize(800,200)

let context = renderer.getContext()

let stave = new Stave(10,40,700)

stave.addClef("treble")

stave.setContext(context).draw()

let notes=[
new StaveNote({keys:["c/4"],duration:"q"}),
new StaveNote({keys:["d/4"],duration:"q"}),
new StaveNote({keys:["e/4"],duration:"q"})
]

Vex.Flow.Formatter.FormatAndDraw(context,stave,notes)

}
