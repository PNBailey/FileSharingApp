import { MessageHandlingService } from "src/app/services/message-handling.service";

export function getMessageHandlingServiceMock() {
    return jasmine.createSpyObj<MessageHandlingService>(
        'MessageHandlingService',
        {
            onDisplayNewMessage: undefined
        }
    );
}

