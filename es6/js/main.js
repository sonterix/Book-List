class Book{
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI{
    // Add book to list
    addBookToList(book){
        const list = document.querySelector('#book-list');
        // create tr element
        const row = document.createElement('tr');
        // insert cols
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="delete">X</a></td>
        `;

        list.appendChild(row);
    }

    // Show alert
    showAlert(message, className){
        // create div
        const div = document.createElement('div');
        // add classes
        div.className = `alert ${className}`;
        // add text
        div.appendChild(document.createTextNode(message));
        // get parent
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        // insert alert
        container.insertBefore(div, form);
        
        // timeaut after 3 sec
        setTimeout(function(){
            document.querySelector('.alert').remove();
        }, 2000);
    }

    // Clear fields
    clearFields(){
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }

    // Delete Book
    deleteBook(target){
        if(target.className === 'delete'){
            target.parentElement.parentElement.remove();
        }
    }
}

class Store{
    static getBooks(){
        let books;
        
        if(localStorage.getItem('books') === null){
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }
    
    static displayBooks(){
        const books = Store.getBooks();
        
        books.forEach(function(book){
            const ui = new UI;
            
            // add book to ui
            ui.addBookToList(book);
        });
    }

    static addBook(book){
        const books = Store.getBooks();

        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn){
        const books = Store.getBooks();

        books.forEach(function(book, index){
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));        
    }
}

// Event Listeners for DOM Load
document.addEventListener('DOMContentLoaded', Store.displayBooks());

// Event Listeners for Add
document.querySelector('#book-form').addEventListener('submit', function(e){
    e.preventDefault();

    // get form data
    const title = document.querySelector('#title').value,
    author = document.querySelector('#author').value,
    isbn = document.querySelector('#isbn').value;

    // instantiate book
    const book = new Book(title, author, isbn);

    // instantiate UI
    const ui = new UI();

    // validate
    if(title === '' || author === '' || isbn === ''){
        // error alert
        ui.showAlert('Please, fill in all fields', 'error')
    } else {
        // add book to list
        ui.addBookToList(book);

        // add to LS
        Store.addBook(book);

        // show success
        ui.showAlert('Book added!', 'success');

        // clear fields
        ui.clearFields();
    }
});

// Event Listeners for Delete
document.querySelector('#book-list').addEventListener('click', function(e){
    e.preventDefault();

    // instantiate UI
    const ui = new UI();

    // delete row
    ui.deleteBook(e.target);

    // remove from UI
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    // show success
    ui.showAlert('Book removed!', 'default');
});