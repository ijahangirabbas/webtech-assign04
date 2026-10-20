let currentSlideNo = 0;
let slides = [];

function loadFromLocalStorage(){
    const data = localStorage.getItem('slides');
    if(data){
        const textArea = document.getElementById('editor');
        textArea.value = data;
        slides = data.split('---');
        renderContent(slides);
        updateCounter();
        updateButtons();
    } else {
        slides = [''];
        renderContent(slides);
        updateCounter();
        updateButtons();
    }
}
window.addEventListener('load', loadFromLocalStorage);

function renderContent(textArray){
    let currentText = textArray[currentSlideNo];
    currentText = currentText.split('\n');
    let finalHTML = "";
    for(let i = 0;i<currentText.length;i++){
        let line = currentText[i];
        line = line.trimStart();
        if(line.startsWith('##')){
            line = line.substring(2);
            finalHTML += ('<h2>' + line + '</h2>');
        }
        else if(line.startsWith('#')){
            line = line.substring(1);
            finalHTML += '<h1>' + line + '</h1>';
        }
        else{
            finalHTML +=(line + '<br>')
        }
    }
    console.log(finalHTML);
    let element = document.getElementById('preview');
    element.innerHTML = finalHTML;
}

function updateButtons(){
    if(currentSlideNo == 0){
        let btnLeft = document.getElementById('btn-left');
        btnLeft.disabled = true;
    }
    else{
        let btnLeft = document.getElementById('btn-left');
        btnLeft.disabled = false;
    }
    if(currentSlideNo == slides.length - 1){
        let btnRight = document.getElementById('btn-right');
        btnRight.disabled = true;
    }
    else{
        let btnRight = document.getElementById('btn-right');
        btnRight.disabled = false;
    }
}

function updateCounter(){
    document.getElementById('current-slide').textContent = currentSlideNo + 1;
    document.getElementById('total-slides').textContent = slides.length;
}
const textArea = document.getElementById('editor');
textArea.addEventListener('input', function (){
    const data = textArea.value;
    currentSlideNo = 0;
    slides = data.split('---');
    renderContent(slides);
    updateCounter();
    updateButtons();
});

const btn_left = document.getElementById('btn-left');
const btn_right = document.getElementById('btn-right');
const btn_fullscreen = document.getElementById('btn-fullscreen');
btn_left.addEventListener('click', function (){
    if(currentSlideNo == 0){
        return;
    }
    currentSlideNo--;
    renderContent(slides);
    updateCounter();
    updateButtons();
})
btn_right.addEventListener('click', function (){
    if(currentSlideNo == slides.length - 1){
        return;
    }
    currentSlideNo++;
    renderContent(slides);
    updateCounter();
    updateButtons();
});
btn_fullscreen.addEventListener('click', function (){
    const preview_container = document.querySelector('.preview-container');
    if(!document.fullscreenElement){
        preview_container.requestFullscreen().catch(function (error){
            console.error('Unable to enter fullscreen mode:', error);
        });
    }
    else{
        document.exitFullscreen().catch(function (error){
            console.error('Unable to exit fullscreen mode:', error);
        });
    }
});
document.addEventListener('fullscreenchange', function (){
    btn_fullscreen.textContent = document.fullscreenElement
        ? 'Exit Fullscreen'
        : 'Fullscreen';
});
document.addEventListener('keydown',function (event){
    if(event.key == 'ArrowLeft'){
        btn_left.click();
    }
    else if(event.key == 'ArrowRight'){
        btn_right.click();
    }
    else if(event.ctrlKey && event.key == 's'){
        event.preventDefault();
        localStorage.setItem('slides', textArea.value);
        alert('Saved to local storage');
    }
    else if(event.key == 'F11'){
        event.preventDefault();
        btn_fullscreen.click();
    }
})