
const socket = io();

socket.on('redirect', data => {
  window.location.href = data.page;
});


const displayEvent = (text) => {
  const parent = document.querySelector('#events');
  const el = document.createElement('p');
  el.innerHTML = text;
  parent.appendChild(el);
};


const clearEvents = () => {
  const parent = document.querySelector('#events');
    parent.innerHTML = '';
};


const startAgain = () => {
  const button = document.getElementById('again');
  button.addEventListener('click', () => {
    location.reload();
  });
};


const nextRound = () => {
  ['rock', 'paper', 'scissors'].forEach((id) => {
    const button = document.getElementById(id);
    button.addEventListener('click', () => {
      clearEvents();
    });
  });
};


const disableButtons = () => {
  ['rock', 'paper', 'scissors'].forEach((id) => {
    const button = document.getElementById(id);
    button.disabled = true;
  });
}


const activateButtons = () => {
  ['rock', 'paper', 'scissors'].forEach((id) => {
    const button = document.getElementById(id);
    button.disabled = false;
  });
}


const buttonListeners = () => {
  ['rock', 'paper', 'scissors'].forEach((id) => {
    const button = document.getElementById(id);
    button.addEventListener('click', () => {
      socket.emit('choice', id);
    });
  });
};


socket.on('message', (text) => {
  displayEvent(text);
});

socket.on('clear', () => {
  clearEvents();
});

socket.on('disable', () => {
  disableButtons();
});

socket.on('activate', () => {
  activateButtons();
});

socket.on('next-round', () => {
  nextRound();
});

buttonListeners();
startAgain();
