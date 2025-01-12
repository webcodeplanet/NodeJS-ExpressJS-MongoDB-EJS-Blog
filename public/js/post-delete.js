// Post Delete Script

document.addEventListener('click', (event) => {
        
    const id = event.target.dataset.id || null;
    
    if (id) {

        const confirmDelete = confirm('Are you sure?');

        if (confirmDelete) {
            fetch(`/posts/${id}`, { method: 'DELETE'})
                .then(() => { window.location.href = '/posts'; });
        }
    };

});