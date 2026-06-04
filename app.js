document.addEventListener('DOMContentLoaded', () => {
    loadStories();

    document.getElementById('memory-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const btn = form.querySelector('button');
        btn.disabled = true;
        btn.textContent = 'Sending...';

        const data = new FormData(form);

        try {
            const res = await fetch(form.action, {
                method: 'POST',
                body: data,
                headers: { 'Accept': 'application/json' }
            });
            if (res.ok) {
                form.reset();
                showMessage('Thank you! Jim will love reading your story.');
            } else {
                showMessage('Something went wrong. Please try again.', true);
            }
        } catch {
            showMessage('Something went wrong. Please try again.', true);
        }
        btn.disabled = false;
        btn.textContent = 'Share with Jim';
    });
});

async function loadStories() {
    const list = document.getElementById('memories-list');
    const gallery = document.getElementById('gallery');

    try {
        const res = await fetch('stories.json');
        const stories = await res.json();

        if (stories.length === 0) {
            list.innerHTML = '<div class="memory-placeholder"><p>Stories coming soon!</p></div>';
            gallery.innerHTML = '<div class="gallery-placeholder"><p>Photos will appear here as they are shared.</p></div>';
            return;
        }

        list.innerHTML = stories.map(s => `
            <div class="memory-card">
                <div class="author">${escapeHtml(s.name)}</div>
                ${s.relationship ? `<div class="relationship">${escapeHtml(s.relationship)}</div>` : ''}
                <div class="text">${escapeHtml(s.text)}</div>
                ${s.photo ? `<img class="photo" src="photos/${s.photo}" alt="Photo shared by ${escapeHtml(s.name)}">` : ''}
            </div>
        `).join('');

        const photos = stories.filter(s => s.photo);
        if (photos.length > 0) {
            gallery.innerHTML = photos.map(s =>
                `<img src="photos/${s.photo}" alt="Photo shared by ${escapeHtml(s.name)}" onclick="openLightbox(this.src)">`
            ).join('');
        } else {
            gallery.innerHTML = '<div class="gallery-placeholder"><p>Photos will appear here as they are shared.</p></div>';
        }
    } catch {
        list.innerHTML = '<div class="memory-placeholder"><p>Stories coming soon!</p></div>';
    }
}

function openLightbox(src) {
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML = `<img src="${src}" alt="Photo">`;
    lb.onclick = () => lb.remove();
    document.body.appendChild(lb);
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function showMessage(text, isError) {
    const msg = document.getElementById('form-message');
    msg.textContent = text;
    msg.style.background = isError ? '#fce4ec' : '#e8f5e9';
    msg.style.color = isError ? '#c62828' : '#2e7d32';
    msg.hidden = false;
    setTimeout(() => { msg.hidden = true; }, 5000);
}
