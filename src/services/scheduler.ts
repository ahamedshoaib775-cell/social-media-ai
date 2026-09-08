import type { PostItem, SchedulerLog } from '../types';
import { publishToMetaAccounts } from './metaApi';

export class SchedulerEngine {
  private logs: SchedulerLog[] = [];
  private isRunning: boolean = false;
  private timerId: number | null = null;
  private onLogsUpdated?: (logs: SchedulerLog[]) => void;
  private onPostStatusChanged?: (postId: string, newStatus: PostItem['status'], err?: string) => void;

  constructor() {
    this.addLog('info', 'Scheduler engine initialized.');
  }

  public setCallbacks(
    onLogsUpdated: (logs: SchedulerLog[]) => void,
    onPostStatusChanged: (postId: string, newStatus: PostItem['status'], err?: string) => void
  ) {
    this.onLogsUpdated = onLogsUpdated;
    this.onPostStatusChanged = onPostStatusChanged;
  }

  public getLogs(): SchedulerLog[] {
    return [...this.logs];
  }

  private addLog(type: SchedulerLog['type'], message: string, postId?: string) {
    const log: SchedulerLog = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
      post_id: postId
    };
    this.logs = [log, ...this.logs.slice(0, 49)];
    if (this.onLogsUpdated) {
      this.onLogsUpdated(this.logs);
    }
  }

  public startAutoCheck(intervalSeconds: number = 30, postsProvider: () => PostItem[]) {
    if (this.isRunning) return;
    this.isRunning = true;
    this.addLog('info', `Automated background scheduler started (Interval: ${intervalSeconds}s).`);

    this.timerId = window.setInterval(() => {
      this.processDuePosts(postsProvider());
    }, intervalSeconds * 1000);
  }

  public stopAutoCheck() {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.isRunning = false;
    this.addLog('info', 'Automated background scheduler paused.');
  }

  public isAutoRunning(): boolean {
    return this.isRunning;
  }

  public async processDuePosts(posts: PostItem[]): Promise<{ processedCount: number; successCount: number }> {
    const scheduledPosts = posts.filter(p => p.status === 'Scheduled');
    const now = new Date();

    let processedCount = 0;
    let successCount = 0;

    this.addLog('info', `Checking ${scheduledPosts.length} scheduled posts for arrival time...`);

    for (const post of scheduledPosts) {
      const postDateTimeStr = `${post.scheduled_date} ${post.scheduled_time || '09:00'}`;
      const postDate = new Date(postDateTimeStr);

      const isDue = isNaN(postDate.getTime()) || postDate <= now || true;

      if (isDue) {
        processedCount++;
        this.addLog('info', `Attempting auto-publish for Post #${post.day_number}: "${post.headline}"`, post.id);

        try {
          const publishResult = await publishToMetaAccounts(post);

          if (publishResult.success) {
            successCount++;
            this.addLog('success', `Published successfully to ${publishResult.platform.toUpperCase()}! Media ID: ${publishResult.metaPostId || 'META_OK'}`, post.id);
            if (this.onPostStatusChanged) {
              this.onPostStatusChanged(post.id, 'Published');
            }
          } else {
            this.addLog('error', `Publishing failed: ${publishResult.error}`, post.id);
            if (this.onPostStatusChanged) {
              this.onPostStatusChanged(post.id, 'Failed', publishResult.error);
            }
          }
        } catch (err: any) {
          const errorMsg = err?.message || 'Unknown network or API error during dispatch';
          this.addLog('error', `Exception caught during post execution: ${errorMsg}`, post.id);
          if (this.onPostStatusChanged) {
            this.onPostStatusChanged(post.id, 'Failed', errorMsg);
          }
        }
      }
    }

    if (processedCount === 0) {
      this.addLog('info', 'No scheduled posts due at this check cycle.');
    }

    return { processedCount, successCount };
  }
}

export const schedulerInstance = new SchedulerEngine();
