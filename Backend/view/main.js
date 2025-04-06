async function fetchMenu() {
    try {
        const response = await fetch('http://localhost:3000/menus');
        const menus = await response.json();
        renderNavBar(menus.data);
        console.log('Menus fetched successfully:', menus.data);
    } catch (error) {
        console.error('Error fetching menu:', error);
    }
}
function renderNavBar(menus) {
    const navBar = document.createElement('nav');
    const ul = document.createElement('ul');

    menus.forEach(menu => {
        const li = document.createElement('li');

        // Phần link của menu cha
        const a = document.createElement('a');
        a.href = menu.url;
        a.textContent = menu.text;
        li.appendChild(a);

        // Nếu có menu con
        if (menu.children && menu.children.length > 0) {
            li.classList.add('has-children'); // Thêm class để xử lý style

            const subUl = document.createElement('ul');
            menu.children.forEach(child => {
                const subLi = document.createElement('li');
                const subA = document.createElement('a');
                subA.href = child.url;
                subA.textContent = child.text;
                subLi.appendChild(subA);
                subUl.appendChild(subLi);
            });
            li.appendChild(subUl);
        }

        ul.appendChild(li);
    });

    navBar.appendChild(ul);
    document.getElementById('main').appendChild(navBar);
}
fetchMenu();