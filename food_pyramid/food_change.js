//increase item count for a particular shelf
function increaseItemCount(shelf) {
    let count = document.getElementById("itemcount" + shelf);
    let current = parseInt(count.textContent);
    count.textContent = current + 1;
}

//decrease item count for a particular shelf
function decreaseItemCount(shelf) {
    let count = document.getElementById("itemcount" + shelf);
    let current = parseInt(count.textContent);
    if (current > 0) {
        count.textContent = current - 1;
    }
}
//date part
const dateControl = document.querySelector('input[type="date"]');
dateControl.value = "2023-01-01";

//Age Select
function ageSelection(age) {
    var txt;

    switch (age) {
        case '1-4': txt = "1-4 years old"; break;
        case 'Over 5': txt = "Over 5 years old"; break;
        case 'Teenager': txt = "Teenager"; break;
        case 'Adult': txt = "Adult"; break;
        default: txt = "Invalid selection";
    }
    document.getElementById("demo").innerHTML = txt;
}