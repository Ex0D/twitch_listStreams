import { config, URL_TWITCH_API } from "./config.js";

export async function getStreamList(game_ids, langs, limit) 
{
    const clientID = document.getElementById('client_id').value;
    const token = document.getElementById('token').value;
    const strIds = game_ids.split(';').reduce((acc, id) => (acc += `&game_id=${id}`), '');
    const strLangs = langs.split(';').reduce((acc, lang) => (acc += `&language=${lang}`), '');    
    const intLimit = Number(limit) + config.lists.block.length;
    const params = `?first=${intLimit}${strIds}${strLangs}`;

    if(!clientID || !token)
    {
        alert('No token or clientID has been defined to fetch datas');
        return window.location = '/index.html';
    }

    const fetchTwitchAPI = await fetch(`${URL_TWITCH_API}${params}`,
    {
        method: 'GET',
        headers:
        {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'Client-ID': clientID,
        },
        mode: 'cors'
    });

    if(fetchTwitchAPI.ok)
    {
        return fetchTwitchAPI.json();
    }
    else
    {
        alert('API ERROR');
        return window.location = '/index.html';
    }

    // fetchTwitchAPI.ok ? fetchTwitchAPI.json() : alert('API ERROR')
}

export function diffListStreams(oldListStreams, listStreams) 
{
    const newListStreams = listStreams.data;
    
    const result = 
    {
        add: [],
        del: []
    };

    if(newListStreams !== undefined)
    {
        oldListStreams.forEach(oldStream =>
        {
            if(!newListStreams.some(newStream => oldStream.user_name === newStream.user_name))
            {
                result.del.push(oldStream);
            }
        });

        newListStreams.forEach(newStream =>
        {
            if(!oldListStreams.some(oldStream => oldStream.user_name === newStream.user_name))
            {
                result.add.push(newStream);
            }
        });
    }

    return result;
}