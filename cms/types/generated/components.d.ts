import type { Schema, Struct } from '@strapi/strapi';

export interface CvRow extends Struct.ComponentSchema {
  collectionName: 'components_cv_rows';
  info: {
    description: 'A single line item within a CV section';
    displayName: 'CV row';
  };
  attributes: {
    body: Schema.Attribute.Text;
    head: Schema.Attribute.String & Schema.Attribute.Required;
    meta: Schema.Attribute.String;
  };
}

export interface CvSection extends Struct.ComponentSchema {
  collectionName: 'components_cv_sections';
  info: {
    description: 'A titled group of CV rows';
    displayName: 'CV section';
  };
  attributes: {
    rows: Schema.Attribute.Component<'cv.row', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomeChaosCard extends Struct.ComponentSchema {
  collectionName: 'components_home_chaos_cards';
  info: {
    description: 'A scattered cross-section card on the home collage';
    displayName: 'Chaos card';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    tag: Schema.Attribute.String & Schema.Attribute.Required;
    text: Schema.Attribute.Text & Schema.Attribute.Required;
    tone: Schema.Attribute.Enumeration<
      ['paper', 'ink', 'yellow', 'sage', 'lilac', 'accent']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'paper'>;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'cv.row': CvRow;
      'cv.section': CvSection;
      'home.chaos-card': HomeChaosCard;
    }
  }
}
