const toggle = document.getElementById('toggle');
    const status = document.getElementById('status');
    const body   = document.getElementById('body');
 
    toggle.addEventListener('change', () => {
      const on = toggle.checked;
      status.textContent = on ? 'On' : 'Off';
      body.classList.toggle('on', on);
    });