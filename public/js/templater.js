import { PLAYER } from "./config.js";

export function templateListItem(username) 
{
    return `
    <li class="list--item">
        <a
            href="${PLAYER}=${username}"
            target="_blank"
            rel="noopener noreferrer"
        >
            ${username}
        </a>
        <button class="mini-button" id="${username}_unblock">X</button>
    </li>
    `;
}

export function templateStream(i) 
{
    return `
        <div class="stream-menu">
            <span class="stream-title">
                <a
                    class="stream-user"
                    target="_blank"
                    href="${PLAYER}=${i.user_name}"
                >
                    ${i.user_name}
                </a>
                - ${i.title}
            </span>
            <div class="stream-menu-buttons" data-username="${i.user_name}">
                <button class="mini-button stream-favorite">F</button>
                <button class="mini-button stream-block">B</button>
                <button class="mini-button stream-close">X</button>
            </div>
        </div>
        <iframe
            class="stream-iframe"
            frameborder="0"
            allowfullscreen="true"
            src="${PLAYER}=${i.user_name}&parent=localhost"
        ></iframe>
    `   
}