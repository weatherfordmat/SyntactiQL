import notifier from 'node-notifier';
import opn from 'opn';

export const onServerStart = (img, port) => {
    if (process.env.NODE_ENV === 'development') {
        notifier.notify({
            title: 'Dev Server Started!',
            message: 'Click To Open GraphiQL in Browser',
            contentImage: img,
            icon: true, 
            sound: false, 
            wait: false,
            timeout: 5,
            actions: 'Open',
            closeLabel: 'Close'
        });
    
        notifier.on('click', (notifierObject, options) => {
            opn(`http://localhost:${port}/graphql`);
        });
    }
}