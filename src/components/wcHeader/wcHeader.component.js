'use strict';

(function() {
  class WcHeader extends HTMLElement {
    constructor() {
      // establish prototype chain
      super();

      // attaches shadow tree and returns shadow root reference
      // https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow
      const shadow = this.attachShadow({ mode: 'open' });

      // creating a container for the editable-list component
      const headerContainer = document.createElement('div');

      // adding a class to our container for the sake of clarity
      headerContainer.classList.add('editable-list');

      // creating the inner HTML of the editable list element
      headerContainer.innerHTML = `
        <style>
            .nav {
                --bs-nav-link-padding-x: 1rem;
                --bs-nav-link-padding-y: 0.5rem;
                --bs-nav-link-font-weight: ;
                --bs-nav-link-color: var(--bs-link-color);
                --bs-nav-link-hover-color: var(--bs-link-hover-color);
                --bs-nav-link-disabled-color: var(--bs-secondary-color);
                display: flex
            ;
                flex-wrap: wrap;
                padding-left: 0;
                margin-bottom: 0;
                list-style: none;
            }
            .nav-link {
                display: block;
                padding: var(--bs-nav-link-padding-y) var(--bs-nav-link-padding-x);
                font-size: var(--bs-nav-link-font-size);
                font-weight: var(--bs-nav-link-font-weight);
                color: var(--bs-nav-link-color);
                text-decoration: none;
                background: 0 0;
                border: 0;
                transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out;
            }
        </style>
        <ul class="nav">
            <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="src/views/apexcharts2/apexcharts2.html">Apex Charts</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="src/views/jscharts/jscharts.html">JS Charts</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="src/views/configuration/configuration.html">Configuration</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="src/views/calculoPerdidas/calculoPerdidas.html">Calculo perdidas</a>
            </li>
        </ul>
      `;

      // appending the container to the shadow DOM
      shadow.appendChild(headerContainer);
    }

  }

  // let the browser know about the custom element
  customElements.define('wc-header', WcHeader);
})();