import { Subjects, Publisher, ExpirationCompleteEvent } from "@mstiketing/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}