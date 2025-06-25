function initKeyboardNav() {
    // State to track navigation direction
    let navigationDirection = 'forward';

    // Utility Functions
    function filterElementsByTags(elements, options = {}) {
        const { tags = [] } = options;
        return elements.filter(element => {
            const tagName = element.tagName.toLowerCase();
            return tags.includes(tagName);
        });
    }

    function getNextElement(activeElement, elements, cycle = true) {
        if (!activeElement || activeElement === document.body) {
            return elements[0] || null;
        }
        const index = elements.indexOf(activeElement);
        console.log("index: ", index)
        if (index === -1) {
            return elements[0] || null;
        }
        const nextElement = elements[index + 1];
        console.log("nextElements: ", nextElement);
        return nextElement || (cycle && elements[0]) || null;
    }

    function getPreviousElement(activeElement, elements, cycle = true) {
        if (!activeElement || activeElement === document.body) {
            return elements[elements.length - 1] || null;
        }
        const index = elements.indexOf(activeElement);
        if (index === -1) {
            return elements[elements.length - 1] || null;
        }
        const prevElement = elements[index - 1];
        return prevElement || (cycle && elements[elements.length - 1]) || null;
    }

    function applyFocusAndStyle(element) {
        if (!element) return;
        element.setAttribute('tabindex', '0');
        element.focus();
        element.classList.add('keyboard-nav-highlight');
    }

    function clearFocusAndStyle(element) {
        if (!element) return;
        element.classList.remove('keyboard-nav-highlight');
        if (element.hasAttribute('tabindex') && element.getAttribute('tabindex') === '0') {
            element.removeAttribute('tabindex');
        }
    }

    function navigateToElement(activeElement, elements, type) {
        // Ignore if form field is focused
        if (activeElement && ['input', 'textarea', 'select'].includes(activeElement.tagName.toLowerCase())) {
            console.log(`Ignoring ${type} navigation: form field focused`);
            return;
        }

        const isForward = navigationDirection === 'forward';
        const nextElement = isForward
            ? getNextElement(activeElement, elements)
            : getPreviousElement(activeElement, elements);

        if (activeElement && activeElement !== document.body) {
            clearFocusAndStyle(activeElement);
        }

        if (nextElement) {
            applyFocusAndStyle(nextElement);
            console.log(`Next ${type} (tag: ${nextElement.tagName.toLowerCase()}${type === 'landmark' ? `` : ''}):`, nextElement);
        } else {
            console.log(`No ${isForward ? 'next' : 'previous'} ${type} found`);
        }
    }

    // Initialize element arrays
    let allTags = document.getElementsByTagName("*");
    let arrayAllTags = Array.from(allTags);
    let headerTags = filterElementsByTags(arrayAllTags, { tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] });
    let linkTags = filterElementsByTags(arrayAllTags, { tags: ['a'] });
    let landmarkTags = filterElementsByTags(arrayAllTags, {
        tags: ['nav', 'main', 'form', 'header', 'footer', 'aside', 'section', 'article']
    });

    // Update arrays on DOM changes
    const observer = new MutationObserver(() => {
        allTags = document.getElementsByTagName("*");
        arrayAllTags = Array.from(allTags);
        headerTags = filterElementsByTags(arrayAllTags, { tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] });
        linkTags = filterElementsByTags(arrayAllTags, { tags: ['a'] });
        landmarkTags = filterElementsByTags(arrayAllTags, {
            tags: ['nav', 'main', 'form', 'header', 'footer', 'aside', 'section', 'article']
        });
        console.log("DOM updated, refreshed element arrays");
    });

    observer.observe(document.body, { childList: true, subtree: true });

    const style = document.createElement('style');
    style.textContent = `
        .keyboard-nav-highlight {
            border: 3px solid #000000 !important;
            background-color: #ffff00 !important;
            outline: none;
            z-index: 1000;
            position: relative;
        }
    `;
    document.head.appendChild(style);

    // Event listener for keyboard navigation
    document.addEventListener('keydown', function (event) {
        console.log(`Key pressed: ${event.key}, Code: ${event.code}`);
        const currentElement = document.activeElement;

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            navigationDirection = 'forward';
            console.log("Navigation direction set to forward");
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            navigationDirection = 'backward';
            console.log("Navigation direction set to backward");
        } else if (event.key === 'h' || event.key === 'H') {
            navigateToElement(currentElement, headerTags, 'header');
            console.log("All header tags:", headerTags.map(el => el.tagName.toLowerCase()));
        } else if (event.key === 'l' || event.key === 'L') {
            navigateToElement(currentElement, linkTags, 'link');
            console.log("All link tags:", linkTags.map(el => el.tagName.toLowerCase()));
        } else if (event.key === 'm' || event.key === 'M') {
            navigateToElement(currentElement, landmarkTags, 'landmark');
            console.log("All landmark tags:", landmarkTags.map(el => ({
                tag: el.tagName.toLowerCase(),
            })));
        }
    });

    // Cleanup function
    return function cleanup() {
        observer.disconnect();
        document.head.removeChild(style);
        document.removeEventListener('keydown', arguments.callee);
        // Clear all highlights
        arrayAllTags.forEach(el => clearFocusAndStyle(el));
    };
}

// Export for injection
if (typeof module !== 'undefined' && module.exports) {
    module.exports = initKeyboardNav;
} else {
    window.initKeyboardNav = initKeyboardNav;
}