import notifier from 'node-notifier';
import opn from 'opn';

/**
 * An extra feature. If this is useful, we can add more event based notifications.
 */

export const OnServerStart = (img, port) => {
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
    
        notifier.on('click', () => {
            opn(`http://localhost:${port}/graphql`);
        });
    }
}

export default OnServerStart;