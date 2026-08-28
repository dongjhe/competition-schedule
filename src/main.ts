import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { bootstrapApplication } from "@angular/platform-browser";
import {
    octoberChildrenMatches,
    septemberChildrenMatches,
    type CompetitionMatch,
} from "./children-division";
import { octoberOpenMatches, septemberOpenMatches } from "./open-division";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="shell">
      <header class="topbar">
        <a class="brand" href="#" aria-label="首頁"
          ><span class="brand-mark">↻</span><span><b>HOME</b></span></a
        >
        <nav class="main-nav" aria-label="主要導覽">
          <a class="active" href="#schedule">賽程</a>
        </nav>
        <div
          class="group-tabs header-tabs"
          role="tablist"
          aria-label="選擇組別"
        >
          <button
            *ngFor="let group of groups"
            role="tab"
            [attr.aria-selected]="activeGroup === group"
            [class.active-group]="activeGroup === group"
            (click)="selectGroup(group)"
          >
            {{ group }}
          </button>
        </div>
      </header>
      <main id="schedule" class="content">
        <section class="intro-row">
          <div>
            <p class="eyebrow">BLADE BATTLE SERIES <span>／</span> 2026</p>
            <h1>
              {{ periodLabel }}{{ activeGroup }}<span class="slash">//</span>
            </h1>
            <p class="subtitle">
              雙北門市巡迴賽程　<span class="status-copy"
                ><i></i> 資料已整理</span
              >
            </p>
          </div>
        </section>
        <div class="month-tabs" role="tablist" aria-label="選擇月份">
          <button
            *ngFor="let month of months"
            role="tab"
            [attr.aria-selected]="activeMonth === month.value"
            [class.active-month]="activeMonth === month.value"
            (click)="selectMonth(month.value)"
          >
            {{ month.label }}
          </button>
        </div>
        <section class="date-strip" aria-label="選擇比賽日期">
          <button
            *ngFor="let day of days"
            class="date-card"
            [class.selected]="selectedDay === day.label"
            (click)="selectDay(day.label)"
          >
            <span>{{ day.week }}</span
            ><strong>{{ day.date }}</strong
            ><small>共 {{ day.count }} 場</small>
          </button>
        </section>
        <section class="toolbar">
          <div class="filter-group">
            <button
              *ngFor="let filter of filters"
              (click)="activeFilter = filter"
              [class.active-filter]="activeFilter === filter"
            >
              {{ filter }}
            </button>
          </div>
          <label class="search"
            ><span>⌕</span
            ><input
              [(ngModel)]="searchTerm"
              placeholder="搜尋店家、地址或電話"
              aria-label="搜尋店家、地址或電話"
          /></label>
        </section>
        <section class="schedule-list">
          <div class="list-heading">
            <span>2026 年 {{ activeMonth }} 月・{{ activeGroup }}</span
            ><span class="heading-line"></span
            ><span class="count-label">{{ visibleMatches.length }} 場賽事</span>
          </div>
          <article
            *ngFor="let match of visibleMatches"
            class="match-row"
            [class.is-live]="match.status === 'live'"
            [style.--accent]="match.accent"
            (click)="openMatch(match)"
          >
            <div class="time-col">
              <strong>{{ match.date }}</strong
              ><b>{{ match.time }}</b
              ><small>{{
                match.status === "live"
                  ? "進行中"
                  : match.status === "done"
                    ? "已結束"
                    : "即將開始"
              }}</small>
            </div>
            <div class="match-main">
              <div class="match-title">
                <span class="stage-tag">{{ match.county }}</span>
                <h2>{{ match.store }}</h2>
              </div>
              <div class="match-meta">
                <span class="court-icon">⌖</span>{{ match.address }}
              </div>
            </div>
            <div class="players">
              <span>{{ match.phone }}</span
              ><b class="versus">{{ match.source }}</b>
            </div>
            <div class="scheduled">
              <strong>{{ activeGroup }}</strong
              ><span>門市賽程</span>
            </div>
            <span class="row-arrow">›</span>
          </article>
          <div class="empty-state" *ngIf="visibleMatches.length === 0">
            找不到符合條件的賽事
          </div>
        </section>
      </main>
      <aside
        class="detail-panel"
        [class.open]="selectedMatch !== null"
        *ngIf="selectedMatch as match"
      >
        <button
          class="close-button"
          (click)="selectedMatch = null"
          aria-label="關閉詳情"
        >
          ×</button
        ><span class="panel-kicker">STORE MATCH DETAILS</span>
        <h2>{{ match.store }}</h2>
        <div class="panel-time">
          <strong>{{ match.date }}</strong
          ><span>{{ match.time }}　・　{{ match.county }}</span>
        </div>
        <div class="player-block store-details">
          <div>
            <small>STORE PHONE</small><strong>{{ match.phone }}</strong>
          </div>
          <b>{{ match.source }}</b>
        </div>
        <div class="detail-line">
          <span>比賽地址</span><b>{{ match.address }}</b>
        </div>
        <div class="detail-line">
          <span>組別</span><b>{{ periodLabel }}{{ activeGroup }}</b>
        </div>
        <div class="detail-line">
          <span>場次狀態</span
          ><b [class.orange]="match.status === 'live'">{{
            match.status === "live" ? "即時進行中" : "尚未開始"
          }}</b>
        </div>
        <button class="primary-button" (click)="selectedMatch = null">
          返回賽程
        </button>
      </aside>
      <div
        class="backdrop"
        *ngIf="selectedMatch"
        (click)="selectedMatch = null"
      ></div>
    </div>
  `,
})
export class AppComponent {
  selectedDay = "全部";
  activeGroup = "公開組";
  activeMonth = "09";
  activeFilter = "全部賽事";
  searchTerm = "";
  selectedMatch: CompetitionMatch | null = null;
  filters = ["全部賽事", "進行中", "即將開始", "已結束"];
  groups = ["公開組", "兒童組"];
  months = [
    { label: "09 月・九月", value: "09" },
    { label: "10 月・十月", value: "10" },
  ];
  get selectedMatches(): CompetitionMatch[] {
    return this.activeGroup === "兒童組"
      ? this.activeMonth === "09"
        ? septemberChildrenMatches
        : octoberChildrenMatches
      : this.activeMonth === "09"
        ? septemberOpenMatches
        : octoberOpenMatches;
  }
  get days(): { week: string; label: string; date: string; count: number }[] {
    const matches = this.selectedMatches;
    return [
      {
        week: "月份",
        label: "全部",
        date: this.activeMonth,
        count: matches.length,
      },
      {
        week: "上旬",
        label: "上旬",
        date: "01",
        count: this.countByPeriod(matches, 1, 11),
      },
      {
        week: "中旬",
        label: "中旬",
        date: "12",
        count: this.countByPeriod(matches, 12, 20),
      },
      {
        week: "下旬",
        label: "下旬",
        date: "21",
        count: this.countByPeriod(matches, 21, 31),
      },
    ];
  }
  get periodLabel(): string {
    return `${this.activeMonth === "09" ? "九" : "十"}月`;
  }
  get visibleMatches(): CompetitionMatch[] {
    const matches = this.selectedMatches;
    return matches.filter((match) => {
      const filterMatch =
        this.activeFilter === "全部賽事" ||
        (this.activeFilter === "進行中" && match.status === "live") ||
        (this.activeFilter === "即將開始" && match.status === "upcoming") ||
        (this.activeFilter === "已結束" && match.status === "done");
      const term = this.searchTerm.trim().toLowerCase();
      const day = this.dayOfMonth(match.date);
      const periodMatch =
        this.selectedDay === "全部" ||
        (this.selectedDay === "上旬" && day <= 11) ||
        (this.selectedDay === "中旬" && day >= 12 && day <= 20) ||
        (this.selectedDay === "下旬" && day >= 21);
      return (
        filterMatch &&
        periodMatch &&
        (!term ||
          `${match.store}${match.phone}${match.address}${match.county}${match.source}`
            .toLowerCase()
            .includes(term))
      );
    });
  }
  private countByPeriod(
    matches: CompetitionMatch[],
    start: number,
    end: number,
  ): number {
    return matches.filter((match) => {
      const day = this.dayOfMonth(match.date);
      return day >= start && day <= end;
    }).length;
  }
  private dayOfMonth(date: string): number {
    return Number(date.split("-").at(-1));
  }
  selectDay(day: string): void {
    this.selectedDay = day;
  }
  selectGroup(group: string): void {
    this.activeGroup = group;
    this.activeMonth = "09";
    this.selectedDay = "全部";
    this.selectedMatch = null;
  }
  selectMonth(month: string): void {
    this.activeMonth = month;
    this.selectedDay = "全部";
    this.selectedMatch = null;
  }
  openMatch(match: CompetitionMatch): void {
    this.selectedMatch = match;
  }
}
bootstrapApplication(AppComponent).catch((error: unknown) =>
  console.error(error),
);
