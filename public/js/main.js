import { config, loadSettings, TIME_TO_UPDATE, updateConfig, saveConfig} from "./config.js";
import { templateListItem, templateStream } from "./templater.js";
import { getStreamList, diffListStreams } from "./streams.js";

let timer = null;

window.onload = () =>
{
    loadSettings();
    renderBlockList();

    document.querySelector('#sidebar-toggle').addEventListener('click', () =>
    {
        document.querySelector('.sidebar').classList.toggle('hide');
    });

    document.querySelector('#update-toggle').addEventListener('click', updateToggle);

    function renderBlockList()
    {
        const { lists } = config;
        document.querySelector(`#block-list`).innerHTML = '';

        lists.block.forEach(i =>
        {
            document.querySelector(`#block-list`).innerHTML += templateListItem(i);
        });

        lists.block.forEach(i =>
        {
            document.querySelector(`${i}_unblock`).addEventListener('click', () =>
            {
                unBlockStream(i);
            });
        });
    }

    function renderStreams(streams)
    {
        const app = document.querySelector('#app');
        const { favorite, block } = config.lists;

        streams.forEach((stream, i) =>
        {
            if(i <= config.values.limit.value)
            {
                if(favorite.some(v => v === stream.user_name)) stream.favorite = true;
                if (!block.some(v => v === stream.user_name))
                {
                    const el = document.createElement('div');
                    el.innerHTML = templateStream(stream);
                    el.id = stream.user_name;
                    el.className = `stream ${stream.favorite ? 'favorite' : ''}`;

                    el.querySelector(`#${stream.user_name} .stream-close`).addEventListener('click', e =>
                    {
                        const user_name = e.target.offsetParent.id;
                        delStreams([{ user_name }]);
                    });

                    el.querySelector(`#${stream.user_name} .stream-favorite`).addEventListener('click', e =>
                    {
                        const user_name = e.target.offsetParent.id;
                        favoriteStream(user_name);
                    });

                    el.querySelector(`#${stream.user_name} .stream-block`).addEventListener('click', e =>
                    {
                        const user_name = e.target.offsetParent.id;
                        blockStream(user_name);
                        delStreams([{ user_name }]);
                    });

                    config.streams.push(stream);

                    app.append(el);
                }
            }
        });
    }

    function blockStream(username)
    {
        config.lists.block.push(username);
        renderBlockList();
        saveConfig();
    }

    function unBlockStream(username)
    {
        config.lists.block.splice(config.lists.block.findIndex(v => v === username), 1);
        renderBlockList();
        saveConfig();
    }

    function favoriteStream(username)
    {
        if(config.lists.favorite.findIndex(v => v === username) === -1)
        {
            config.lists.favorite.push(username);
        }
        else
        {
            unFavoriteStream(username);
        }

        document.querySelector(`#${username}`).classList.toggle('favorite');
        saveConfig();
    }

    function unFavoriteStream(username)
    {
        config.lists.favorite.splice(config.lists.favorite.findIndex(v => v === username), 1);
    }

    function updateToggle()
    {
        const start = document.querySelector('#update-toggle');
        if (start.innerText === 'STOP UPDATE')
        {
            clearTimeout(timer);
            start.innerText = 'START UPDATE';
        }
        else
        {
            update();
            timer = setInterval(update, TIME_TO_UPDATE);
            start.innerHTML = 'STOP UPDATE';
        }
    }

    async function update()
    {
        const { game_id, lang, limit } = config.values;
        const { streams } = config;

        const newStreams = await getStreamList(game_id.value, lang.value, limit.value);
        const listStreams = diffListStreams(streams, newStreams);

        if(!(!listStreams.del & !listStreams.add))
        {
            delStreams(listStreams.del);
            addStreams(listStreams.add);
        }

        saveConfig();
    }

    function addStreams(streams)
    {
        renderStreams(streams);
    }

    function delStreams(streams)
    {
        streams.forEach(stream =>
        {
            config.streams.splice(config.streams.findIndex(v => v.user_name === stream.user_name));
        });
        removeStreams(streams);
    }

    function removeStreams(streams)
    {
        streams.forEach(stream =>
        {
            document.querySelector(`#${stream.user_name}`).remove();
        });
    }
}