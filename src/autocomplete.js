const autocomplete = function() {
  const KEYCODE = { ENTER: 13, ESC: 27, UPARROW: 38, DOWNARROW: 40 };
  const LEFTBUTTON = 0;

  class AutoComplete {
    constructor(config) {
      this.isOpen = false;
      this.selectedIndex = -1;
      this.config = config;
      this.minNumChars = 2;
      this.maxDisplayItems = 10;
      this.input = document.querySelector(config.input);

      var wrapperElement = document.createElement("div");
      wrapperElement.classList.add("autocomplete__wrapper");
      this.input.parentNode.replaceChild(wrapperElement, this.input);
      this.input.setAttribute("aria-autocomplete", "list");
      wrapperElement.appendChild(this.input);

      const suggestions = document.createElement("ul");
      suggestions.classList.add("autocomplete__suggestions", "hidden");
      this.suggestions = this.input.parentNode.insertBefore(suggestions, this.input.nextSibling);
      this.bindEvents(this.$input);
    }

    close() {
      if (this.isOpen) {
        this.suggestions.classList.add("hidden");
        this.isOpen = false;
        this.selectedIndex = -1;
      }
    }

    open() {
      if (!this.isOpen) {
        this.suggestions.classList.remove("hidden");
        this.isOpen = true;
        this.selectedIndex = -1;
      }
    }

    getAutoCompleteListItemHtml(autoCompleteOption) {
      return `<li class="autocomplete__suggestion" aria-selected="false" data-val="${autoCompleteOption}">${autoCompleteOption}</li>`;
    }

    evaluate(event) {
      const currentSearchTerm = event.target.value;
      if (currentSearchTerm.length < this.minNumChars) {
        this.close();
        return;
      }
      const autocompleteOptions = this.config.autocompleteSearchFunction(currentSearchTerm);
      if (autocompleteOptions) {
        const slicedAutoCompleteOptions = autocompleteOptions.slice(0, this.maxDisplayItems);
        const autoCompleteOptionsHtml = slicedAutoCompleteOptions.map(this.getAutoCompleteListItemHtml).join("");
        this.suggestions.innerHTML = autoCompleteOptionsHtml;
        this.open();
      } else {
        this.close();
      }
    }

    getNextIndex(num1, num2) {
      return (num1 % num2 + num2) % num2;
    }

    getSuggestionIndex(elem) {
      let index = 0;
      while(elem = elem.previousElementSibling) {
        index++;
      }
      return index;
    }

    handleSubmit(event, value) {
      this.input.value = value;
      if (this.config.handleSubmit) {
        this.config.handleSubmit(event.value)
      }
      this.close();
    }

    setSelectedIndex(index) {
      const newIndex = this.getNextIndex(index, this.suggestions.childNodes.length);

      if (this.suggestions.childNodes.length === 0) {
        return;
      }

      if (this.selectedIndex != -1 && this.suggestions.childNodes[this.selectedIndex]) {
        const oldSelected = this.suggestions.childNodes[this.selectedIndex];
        oldSelected.classList.remove("selected");
        oldSelected.setAttribute("aria-selected", false);
      }
      const newSelected = this.suggestions.childNodes[newIndex];
      newSelected.classList.add("selected");
      newSelected.setAttribute("aria-selected", true);

      this.selectedIndex = newIndex;
      return newSelected;
    }

    handleKeyDown(event) {
      const keyCode = event.keyCode;
      if (keyCode === KEYCODE.ENTER) {
        event.preventDefault();
        if (this.selectedIndex === -1 || !this.isOpen) {
          return;
        }
        const selectedElement = this.suggestions.childNodes[this.selectedIndex];
        if (!selectedElement || !selectedElement.dataset.val) {
          return;
        }
        this.handleSubmit(event, selectedElement.dataset.val);
      } else if (keyCode === KEYCODE.ESC) {
        this.close();
      } else if (keyCode === KEYCODE.UPARROW && this.isOpen) {
        this.setSelectedIndex(this.selectedIndex - 1);
      } else if (keyCode === KEYCODE.DOWNARROW && this.isOpen) {
        this.setSelectedIndex(this.selectedIndex + 1);
      }
    }

    handleClick(event) {
      if (event.button === LEFTBUTTON) {
        const newIndex = this.getSuggestionIndex(event.target);
        const selectedElement = this.setSelectedIndex(newIndex);
        this.handleSubmit(event, selectedElement.dataset.val);
      }
    }

    bindEvents() {
      this.input.addEventListener("change", this.evaluate.bind(this));
      this.input.addEventListener("input", this.evaluate.bind(this));
      this.input.addEventListener("keydown", this.handleKeyDown.bind(this));
      this.input.addEventListener("blur", this.close.bind(this));
      this.suggestions.addEventListener("mousedown", this.handleClick.bind(this));
    }
  }

  return {
    init: config => {
      new AutoComplete(config);
    }
  };
}();
