import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { catchError, map, tap, throwError } from 'rxjs';
import { Section } from '../../models/section.model';
import { SectionService } from '../../services/section.service';
import {
  DeleteContent,
  FetchContent,
  InitializeApp,
  SaveContent,
  UpdateContent,
  UploadImage,
} from '../actions/section.actions';

export interface ContentStateModel {
  sections: { [key: string]: Section[] };
  loading: boolean;
  error: string | null;
}

@State<ContentStateModel>({
  name: 'content',
  defaults: {
    sections: {},
    loading: false,
    error: null,
  },
})
@Injectable()
export class ContentState {
  constructor(private sectionService: SectionService) {}

  @Selector()
  static getSection(state: ContentStateModel) {
    return (section: string) => state.sections[section] || [];
  }

  @Selector()
  static getAllSections(state: ContentStateModel) {
    return state.sections;
  }

  @Action(InitializeApp)
  initialize(ctx: StateContext<ContentStateModel>) {
    return this.sectionService.findAll().pipe(
      tap((sections) => {
        const groupedSections = sections.reduce(
          (acc: { [key: string]: Section[] }, section: any) => {
            const sectionType = section.section;
            if (!acc[sectionType]) {
              acc[sectionType] = [];
            }
            acc[sectionType].push(section);
            return acc;
          },
          {}
        );

        ctx.patchState({
          sections: groupedSections,
        });
      })
    );
  }

  @Action(FetchContent)
  fetchContent(ctx: StateContext<ContentStateModel>, action: FetchContent) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    return this.sectionService.getSection(action.section).pipe(
      tap((content) => {
        ctx.patchState({
          sections: {
            ...state.sections,
            [action.section]: content,
          },
          loading: false,
        });
      }),
      catchError((error) => {
        ctx.patchState({ error: error.message, loading: false });
        return throwError(() => error);
      })
    );
  }

  @Action(SaveContent)
  saveContent(ctx: StateContext<ContentStateModel>, action: SaveContent) {
    return this.sectionService.createSection(action.content).pipe(
      tap((saved) => {
        const state = ctx.getState();
        const section = action.content.section || 'about';
        ctx.patchState({
          sections: {
            ...state.sections,
            [section]: [...state.sections[section], saved],
          },
        });
      })
    );
  }

  @Action(UpdateContent)
  updateContent(ctx: StateContext<ContentStateModel>, action: UpdateContent) {
    return this.sectionService.updateSection(action.content).pipe(
      tap((updated) => {
        const state = ctx.getState();
        const sectionType = updated.section;
        const sections = { ...state.sections };

        sections[sectionType] = sections[sectionType].map((item) =>
          item.id === updated.id ? updated : item
        );

        ctx.patchState({ sections });
      })
    );
  }

  @Action(UploadImage)
  uploadImage(ctx: StateContext<ContentStateModel>, action: UploadImage) {
    return this.sectionService
      .uploadImage(action.file)
      .pipe(map((response: { imageUrl: string }) => response));
  }

  @Action(DeleteContent)
  deleteContent(ctx: StateContext<ContentStateModel>, action: DeleteContent) {
    return this.sectionService.deleteSection(action.id).pipe(
      tap(() => {
        const state = ctx.getState();
        const section = state.sections['team'] || [];
        ctx.patchState({
          sections: {
            ...state.sections,
            team: section.filter((member) => member.id !== action.id),
          },
        });
      })
    );
  }
}
