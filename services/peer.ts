import Peer from 'peerjs';

let peer: Peer;

export const getInstancePeer = (id: string) => {
    if (!(peer instanceof Peer))
        peer = new Peer(id, { host: 'peer-social-core-2021.herokuapp.com', secure: true });
    return peer;
};
