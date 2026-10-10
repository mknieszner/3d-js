import './style.css';
import Experience from './Experience/Experiance.js'
import Scenario from "./Experience/Scenario/Scenario.js";
import Resources from "./Experience/Utils/Resources.js";

window.scenario = new Scenario();

window.animationPrev = () => {
    window.scenario.prev()
};

window.animationNext = () => {
    window.scenario.next()
};

window.startPresentation = () => {
    document.getElementById("cover")?.remove();
};

window.experience = new Experience(document.querySelector('canvas.webgl'));

document.addEventListener("keydown",function(e){
    if(e.keyCode === 37) {
        window.animationPrev()
    }
    if(e.keyCode === 39) {
        window.animationNext()
    }
});

experience.resources.on(Resources.READY_EVENT, () => {
    setTimeout(() => {
        document.getElementById("cover")?.remove();
    }, 0)
});
