import Peer from 'peerjs';

let peer: Peer;

export const getInstancePeer = (id: string) => {
    if (!(peer instanceof Peer))
        peer = new Peer(id);
    return peer;
};
