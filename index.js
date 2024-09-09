
// scroll to  top buttonevent 
const scrollToBottom = () => {
    const scrollableDiv = document.getElementById('listBox');
    scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
}
const buttonevent = (event, value) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        value();
    }
}
// empty the value on relod 
const clear = (id, perform) => {
    const field = document.getElementById(id);
    field[perform] = '';

}


// fetching and showing the data 
const getItemResults = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryid = urlParams.get('id');
    const name = urlParams.get('name');
    const url = `http://localhost:3000/todolist?categoryid=${categoryid}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    clear('inputfield', 'value');
    clear('listBox', 'innerHTML');

    const topic = document.getElementById('topic');
    topic.textContent = name;

    data.forEach((item) => {


        const customListBox = document.getElementById('listBox');
        const customNotes = document.createElement('div');

        const para = document.createElement('p');
        const dlink = document.createElement('a');
        const dimg = document.createElement('img');
        dimg.setAttribute('src', './delete.svg');
        dlink.href = '#';
        dlink.className = 'dlink';
        customNotes.className = 'customNotes';
        para.textContent = item.item;

        dlink.addEventListener('click', (event) => {
            event.preventDefault();
            deleteItem(item.id, 'delete');
        })

        dlink.appendChild(dimg);
        customNotes.appendChild(para);
        customNotes.appendChild(dlink);
        customListBox.appendChild(customNotes);
    });
    scrollToBottom();
};

const getResults = async () => {
    const response = await fetch('http://localhost:3000/', {
        method: 'GET'
    });
    const data = await response.json();
    clear('inputfield', 'value');
    clear('listBox', 'innerHTML');
    data.forEach((item) => {
        const customListBox = document.getElementById('listBox');
        const customNotes = document.createElement('div');
        const customBlock = document.createElement('div');
        const alink = document.createElement('a');
        const para = document.createElement('p');
        const dlink = document.createElement('a');
        const dimg = document.createElement('img');
        const aimg = document.createElement('img');
        dimg.setAttribute('src', './delete.svg');
        aimg.setAttribute('src', './readmore.svg');


        alink.href = '#';
        dlink.href = '#';
        alink.className = 'linkstyle';
        dlink.className = 'dlink';
        dlink.addEventListener('click', (event) => {
            event.preventDefault();
            deleteItem(item.id, 'menudelete');
        })
        alink.addEventListener('click', (event) => {
            event.preventDefault();
            handleitemclick(item.id, item.name);
        });



        customNotes.className = 'customNotes';
        customBlock.className = 'customBlock';
        para.textContent = item.name;


        dlink.appendChild(dimg);
        alink.appendChild(aimg);

        customNotes.appendChild(customBlock);
        customNotes.appendChild(dlink);
        customBlock.appendChild(alink);
        customBlock.appendChild(para);
        customListBox.appendChild(customNotes);
    });
    scrollToBottom();
};

// enter the data to db 

const addlist = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryid = urlParams.get('id');

    const input = document.getElementById('inputfield').value;
    const item = input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();

    const url = 'http://localhost:3000/todolist';
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ categoryid, item }),
        });

        getItemResults();
    } catch (error) {
        console.error('Error:', error);
    }
};

const addButton = async () => {
    const input = document.getElementById('inputfield').value;
    const inputfield = input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
    const url = 'http://localhost:3000/todocategory';
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ inputfield }),
        });

        getResults();
    } catch (error) {
        console.error('Error:', error);
    }
};


// deleting item from db 

const deleteItem = async (categoryid, value) => {
    const url = 'http://localhost:3000/delete';
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ categoryid, value }),
        });
        const data = await response.json();
        if (value == 'menudelete') {
            getResults();
        }
        else {
            getItemResults();
        }


    }
    catch (error) {
        console.log(error);
    }
}




const handleitemclick = (categoryid, name) => {
    window.location.href = `NotesItem.html?id=${categoryid}&name=${name}`;
};


if (window.location.pathname === '/index.html') {
    document.addEventListener('DOMContentLoaded', getResults);
}
if (window.location.pathname === '/NotesItem.html') {
    document.addEventListener('DOMContentLoaded', getItemResults);
}