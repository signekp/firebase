const list = document.querySelector('ul'); 
const form = document.querySelector('.formAdd'); 
const listSearch = document.querySelector('.todos')
const search = document.querySelector('.search input')


const addRecipe = (recipe, id) => {
    let time = recipe.created_at.toDate(); 
    let html = `
    <li data-id="${id}">
        <div><h3>${recipe.title}</h3></div>
        <div><p class="note-body">${recipe.notes}</p></div>
        <p class="checkbox-important" id="vigtigeNoters"></p>
        <div><p class="time">${time}</p></div>
        <button class="btn btn-danger btn-sm my-2" id="deleteButton">Delete</button>
        <button class="btn btn-sm my-2" id="updateButton">Update</button>
    </li>
    `;

    list.innerHTML += html; 
    form.reset();

}



// get elements

// delete
const deleteRecipe = (id) => {
 const recipes = document.querySelectorAll('li');
 recipes.forEach(recipe => {
     if(recipe.getAttribute('data-id') === id) {
         recipe.remove();
     }
 })
}

//update

   const updateNote = (data, id) => {
    let recipes = document.querySelector(`li[data-id="${id}"]`);
    let importantNote = recipes.querySelector('.checkbox-important');
    let title = recipes.querySelector('h3');
    let notes = recipes.querySelector('.note-body');

    title.innerText = data.title;
    notes.innerText = data.notes;

    if (data.Important) {
        importantNote.style.display = 'inline-block';
    }

    else {
        importantNote.style.display = 'none';
    }
    form.reset();
};



// real time
db.collection('recipes').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        const doc = change.doc;
        if (change.type == "added") {
            addRecipe(doc.data(), doc.id); 
        } 
        
         else if (change.type == "removed") {
            deleteRecipe(doc.id); 
            return; 

        }  else if (change.type == "modified") {
            updateNote(doc.data(), doc.id);

            
        }

        
        // checkmark
        let getID = document.querySelector(`li[data-id="${doc.id}"]`);
        let importantText = getID.querySelector('.checkbox-important')

        if (doc.get('Important') === true) {
            importantText.innerText = 'important' 
        }
        else {
            importantText.innerText = '';
        }

        
        
           
    });

});




// Add documents 
form.addEventListener('submit', e =>{
    e.preventDefault(); 

    // checkbox

    const importantNote = document.querySelector('#important');
    let importantOutput = ''; 

    if(importantNote.checked) {
        importantOutput = true;
    } else {
         importantOutput = false;
    }

    // outputting the data
    const now = new Date(); 
    const recipe = {
        title: form.recipe.value,
        notes: form.notes.value,
        Important: importantOutput,
        created_at: firebase.firestore.Timestamp.fromDate(now)
        
    };

    db.collection('recipes').add(recipe).then(() => {
        console.log('recipe added')
       
    }).catch(err => {
        console.collection(err)
    })


} ); 




// deleting data

list.addEventListener('click', e => {
   // console.log(e); 
   if(e.target.id === 'deleteButton') {
        const id = e.target.parentElement.getAttribute('data-id');
        db.collection('recipes').doc(id).delete().then(() => {
            console.log('recipe deleted')
        }); 
   }

})


// update


list.addEventListener('click', e => {
    e.preventDefault(); 
    // console.log(e); 
    if(e.target.id === 'updateButton') {
         const id = e.target.parentElement.getAttribute('data-id');
         const importantNote = document.querySelector('#important');
        let importantOutput = ''; 

    if(importantNote.checked) {
        importantOutput = true;
    } else {
         importantOutput = false;
    }
    const updateNote = {
        notes: form.notes.value,
        title: form.recipe.value,
        Important: importantOutput
        };
        db.collection('recipes').doc(id).update(updateNote).then(() => {
            console.log('Note updated!');
         }); 
    }
 
 }) 


// search

const filterTodos = (term) => {
    Array.from(list.children)
    .filter((todo) => !todo.textContent.toLowerCase().includes(term))
    .forEach((todo) => todo.classList.add('filtered')); 

    Array.from(list.children)
    .filter((todo) => todo.textContent.toLowerCase().includes(term))
    .forEach((todo) => todo.classList.remove('filtered')); 
};

//key event search

search.addEventListener('keyup', () => {
    const term = search.value.trim().toLowerCase(); 
    filterTodos(term)
})


// Show only importans

const importantSearch = document.querySelector('.searchImportant')

importantSearch.addEventListener('click', e => {

    if (document.getElementById('filter_IN').checked) {

        db.collection('recipes').onSnapshot(snapshot => {
            snapshot.docs.forEach(doc => {

                const id = doc.id;
                const data = doc.data();
                const card = document.querySelector(`li[data-id="${id}"]`);
            
                if (data.Important != true) {
                    card.style.display = 'none';
                    
                }
            })  
        });
    }

    else {
        db.collection('recipes').onSnapshot(snapshot => {
            snapshot.docs.forEach(doc => {

                const id = doc.id;
                const card = document.querySelector(`li[data-id="${id}"]`);
                const searchForinput = document.querySelector('#searchID');
            
                card.style.display = 'inline-block';
                searchForinput.value = '';
                
            })
            

        })
    }
})
