const API = "http://localhost:3000/notes";

function loadNotes() {
    fetch(API)
        .then((res) => res.json())
        .then((data) => {
            const list = document.getElementById("list");
            list.innerHTML = "";

            data.forEach((note) => {
                // Format tanggal
                const date = new Date(note.tanggal_dibuat);
                const formattedDate = date.toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                list.innerHTML += `
                    <div class="note">
                        <small style="color: #999;">ID: ${note.id} | ${formattedDate}</small>
                        <h3>${note.judul}</h3>
                        <p>${note.isi}</p>
                        <button onclick="hapus(${note.id})">Hapus</button>
                        <button onclick="edit(${note.id}, '${note.judul}', '${note.isi}')">Edit</button>
                    </div>
                `;
            });
        });
}

function tambahCatatan() {
    const judul = document.getElementById("judul").value;
    const isi = document.getElementById("isi").value;

    fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ judul, isi })
    }).then(() => loadNotes());
}

function hapus(id) {
    fetch(`${API}/${id}`, { method: "DELETE" }).then(() => loadNotes());
}

function edit(id, judul, isi) {
    const newJudul = prompt("Judul:", judul);
    const newIsi = prompt("Isi:", isi);

    fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ judul: newJudul, isi: newIsi })
    }).then(() => loadNotes());
}

loadNotes();
