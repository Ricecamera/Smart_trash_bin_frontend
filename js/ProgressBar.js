const safeColor = "#70D158";
const warningColor = "#F5D04A"
const dangerColor = "#EA4D4D";

// ProgressBar with serparate percent number
class ProgressBar {
    constructor(element, label, initialValue = 0) {
        this.valueElem = $(label).get(0);
        this.fillElem = $(`${element}>.trash-icon-fill`).get(0);
        this.unfillElem = $(`${element}>.trash-icon-unfill`).get(0);
        /*console.log(this.fillElem);
        console.log(this.unfillElem);
        console.log(this.valueElem);*/

        this.setValue(initialValue);
    }

    setValue(newValue) {
        if(newValue < 0) {
            newValue = 0;
        } else if(newValue > 100) {
            newValue = 100;
        }

        this.value = newValue;
        this.update();
    }

    update() {
        const percentage = this.value + "%";
        const unfillPercentage = (100 - this.value) + "%";

        this.valueElem.innerHTML = percentage;
        this.unfillElem.style.height = unfillPercentage;

        if(this.value > 75) {
            this.fillElem.style.color = dangerColor;
            this.valueElem.style.color = dangerColor;
        }
        else if(this.value > 45) {
            this.fillElem.style.color = warningColor;
            this.valueElem.style.color = warningColor;
        } else {
            this.fillElem.style.color = safeColor;
            this.valueElem.style.color = safeColor;
        }
    }
}