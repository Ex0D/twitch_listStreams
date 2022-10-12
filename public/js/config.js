export const PLAYER = 'https://player.twitch.tv/?muted=true&channel';
export const URL_TWITCH_API = 'https://api.twitch.tv/helix/streams';
export const TIME_TO_UPDATE = 8500;

export const config = 
{
    values: 
    {
        game_id:
        {
            value: '',
            default: '21779'
        },

        lang: 
        {
            value: '',
            default: 'fr'
        },
        
        limit: 
        {
            value: '',
            default: '10'
        }
    },

    lists:
    {
        favorite: [],
        block: []
    },

    streams: []
};

export function updateConfig(id, value) 
{
    config.values[id].value = value;
    saveConfig();
}

export function saveConfig() 
{
    const { values, lists } = config;    

    Object.keys(values).forEach(id =>
    {
        localStorage.setItem(id, document.querySelector(`#${id}`).value);
    });

    Object.keys(lists).forEach(list =>
    {
        localStorage.setItem(list, JSON.stringify(lists[list]));
    });
}

export function loadSettings() 
{
    const { values, lists } = config;
    
    Object.keys(values).forEach(id =>
    {
        const value = localStorage.getItem(id) || values[id].default;
        document.querySelector(`#${id}`).value = value;
        values[id].value = value;
    });

    Object.keys(lists).forEach(list =>
    {
        const arr = JSON.parse(localStorage.getItem(list)) || [];
        lists[list] = arr;
    });
}