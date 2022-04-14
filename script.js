const addBtn = document.querySelector('.add-action');
const removeBtn = document.querySelector('.remove-action');
const modalclick = document.querySelector('.modal-cont');
const maincont = document.querySelector('.main-cont');
const textarecont = document.querySelector('.textarea-cont');
let Ftab = false;
let removeFlag = false;
const toolBoxColors = document.querySelectorAll(".color")

let allPriorityColors = document.querySelectorAll(".colorchoice-cont");
let colors = ["pink", "blue", "green", "black"];
let modalPriorityColor = colors[colors.length - 1];

let lockClass = "fa-lock";
let unlockClasss = "fa-lock-open";
let ticketsArr = [];

// Retrieve data and display it
if(localStorage.getItem("jira_tickets")){
    ticketsArr= JSON.parse(localStorage.getItem("jira_tickets"));
    ticketsArr.forEach((ticketsobj) => {

        createTicket(ticketsobj.ticketColor, ticketsobj.TicketTask, ticketsobj.TicketID);
        
    })

    


}

// filter the tickets on click funtionality
for (let i = 0; i < toolBoxColors.length; i++) {
    toolBoxColors[i].addEventListener("click", (e) => {
        let currentToolBoxColor = toolBoxColors[i].classList[0];
        let filtredTickets = ticketsArr.filter((ticketsobj, idx) => {
            return currentToolBoxColor === ticketsobj.ticketColor;
        })
        // remove previous tickets
        let allTicketsCont = document.querySelectorAll(".ticket-gen-cont");
        for (let i = 0; i < allTicketsCont.length; i++) {
            allTicketsCont[i].remove();
        }
        // display new filtredtickets
        filtredTickets.forEach((ticketsobj, idx) => {
            createTicket(ticketsobj.ticketColor, ticketsobj.TicketTask, ticketsobj.TicketID)
        })
    })


        toolBoxColors[i].addEventListener("dblclick", (e)=>{
            let allTicketsCont = document.querySelectorAll(".ticket-gen-cont");
        for (let i = 0; i < allTicketsCont.length; i++) {
            allTicketsCont[i].remove();
        }
        ticketsArr.forEach((ticketsobj,idx)=>{
            createTicket(ticketsobj.ticketColor, ticketsobj.TicketTask, ticketsobj.TicketID);
            
        })
 
        })

       
}





// event Listner for modal priority coloring
allPriorityColors.forEach((colorElment, idx) => {
    colorElment.addEventListener("click", (e) => {
        allPriorityColors.forEach((priorityColorElment, idx) => {
            priorityColorElment.classList.remove("border");
        })
        colorElment.classList.add("border");
        modalPriorityColor = colorElment.classList[0];

    })
})


// event listner for the add and remove of tickets
addBtn.addEventListener("click", (e) => {

    Ftab = !Ftab
    if (Ftab) {
        modalclick.style.display = 'flex'
    } else {
        modalclick.style.display = 'none'
    }
})

removeBtn.addEventListener("click", (e) => {
    removeFlag = !removeFlag;

})

//  eventlistner when shift is been clicked it will add a,
// task ticket in backgound 
modalclick.addEventListener("keydown", (e) => {
    let key = e.key;
    if (key == "Shift") {
        createTicket(modalPriorityColor, textarecont.value);
        Ftab = false;
        setModalToDefault();

    }
})

function createTicket(ticketColor, TicketTask, TicketID) {
    let id = TicketID || shortid();
    let ticketCount = document.createElement("div");
    ticketCount.setAttribute("class", "ticket-gen-cont");
    ticketCount.innerHTML = `
    <div class="top-border ${ticketColor}"></div>
    <div class="ticket-id">#${id}</div>
    <div class="ticket-text">${TicketTask}</div>
    <div class="ticket-lock">
    <i class="fas fa-lock"></i>
    </div>
    `;
    maincont.appendChild(ticketCount);
    // CREATE OBJ OF TICKET AND ADD TO TICKETSARR
    if (!TicketID) {
        ticketsArr.push({ ticketColor, TicketTask, TicketID: id });
        localStorage.setItem("jira_tickets", JSON.stringify(ticketsArr));
    }

    handleRemoval(ticketCount,id);
    handleLock(ticketCount, id);
    handleColor(ticketCount, id);
}


// funtions--->

function handleRemoval(ticket, id) {
    ticket.addEventListener("click", (e)=>{ 
        if (!removeFlag) return;

      let idx = getTicketIdx(id);

        ticketsArr.splice(idx,1);
        let stringTicketsArr= JSON.stringify(ticketsArr);
        localStorage.setItem("jira_tickets", stringTicketsArr);

        ticket.remove(); //UI removal
        })
    
}

function handleLock(ticket, id) {
    let ticketLockElemnet = ticket.querySelector(".ticket-lock");
    let ticketLock = ticketLockElemnet.children[0];
    let ticketTextArea = ticket.querySelector(".ticket-text");
    ticketLock.addEventListener("click", (e) => {
        let ticketIdx=getTicketIdx(id);

        if (ticketLock.classList.contains(lockClass)) {
            ticketLock.classList.remove(lockClass);
            ticketLock.classList.add(unlockClasss);
            ticketTextArea.setAttribute("contenteditable", "true");
        } else {
            ticketLock.classList.remove(unlockClasss);
            ticketLock.classList.add(lockClass);
            ticketTextArea.setAttribute("contenteditable", "false");

        }

        ticketsArr[ticketIdx].TicketTask= ticketTextArea.innerText;
        localStorage.setItem("jira_tickets", JSON.stringify(ticketsArr));
    })
}

function handleColor(ticket, id) {
    let ticketColor = ticket.querySelector(".top-border");
    ticketColor.addEventListener("click", (e) => {
        let ticketIdx = getTicketIdx(id);
        let currentTicketColor = ticketColor.classList[1];

        let currentTicketColorIdx = colors.findIndex((color) => {
            return currentTicketColor === color;
        })

        currentTicketColorIdx++;

        let newTicketColorIdx = currentTicketColorIdx % colors.length;
        let newTicketColor = colors[newTicketColorIdx];
        ticketColor.classList.remove(currentTicketColor);
        ticketColor.classList.add(newTicketColor);
        
        //MOdify data in localStorage (priority color change)
        ticketsArr[ticketIdx].ticketColor= newTicketColor
        localStorage.setItem("jira_tickets", JSON.stringify(ticketsArr)); 
    })
}

// this a funtion which helps in modifying the changes of color choice into the local storage;
function getTicketIdx(id){
    let ticketIdx = ticketsArr.findIndex((ticketsobj)=>{
        return ticketsobj.TicketID === id;
    }) 
    return ticketIdx;
}

function setModalToDefault() {
    modalclick.style.display = "none";
    textarecont.value = "";
    modalPriorityColor = colors[colors.length - 1];
    allPriorityColors.forEach((priorityColorElem, idx) => {
        priorityColorElem.classList.remove("border");
    })
    allPriorityColors[allPriorityColors.length - 1].classList.add("border");
}