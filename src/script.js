import './style.css';
import Experience from './Experience/Experiance.js'
import Scenario from "./Experience/Scenario/Scenario.js";
import Resources from "./Experience/Utils/Resources.js";

window.scenario = new Scenario();

window.animationPrev = () => {
    if (window.experience?.world.isReady) window.scenario.prev()
};

window.animationNext = () => {
    if (window.experience?.world.isReady) window.scenario.next()
};

window.startPresentation = () => {
    if (window.experience?.world.isReady) document.getElementById("cover")?.remove();
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

experience.resources.on(Resources.READY_EVENT, async () => {
    try {
        await experience.world.ready;
        document.getElementById("cover")?.remove();
    } catch (error) {
        console.error('Nie udało się przygotować prezentacji:', error);
        document.getElementById('loader').textContent = 'Nie udało się przygotować prezentacji. Odśwież stronę.';
    }
});
