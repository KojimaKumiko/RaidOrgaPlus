const _json = require('./jsonHandler');

exports.getRaid = getRaid;
exports.setRaid = setRaid;

function setRaid(channel, raid) {
    let newChannels = _json.read('channels');
    newChannels = newChannels.filter(c => c.channel !== channel);
    newChannels.push({channel, raid});
    _json.write('channels', newChannels);
}

function getRaid(channel) {
    const channels = _json.read('channels');
    const foundChannel = channels.filter(c => c.channel === channel)[0];
    if (foundChannel) return foundChannel.raid;
}