import Sniffr from 'sniffr';

const sniffr = new Sniffr();
sniffr.sniff();

sniffr.iOS = sniffr.os.name === 'macos';

export default sniffr;
