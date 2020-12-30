import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';
import { ChatSearchUserComponent } from './chat-search-user/chat-search-user.component';
import { ChatConversationComponent } from './chat-conversation/chat-conversation.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ChatComponent,
    ChatSearchUserComponent,
    ChatConversationComponent,
  ],
  imports: [CommonModule, ChatRoutingModule, ReactiveFormsModule],
})
export class ChatModule {}
