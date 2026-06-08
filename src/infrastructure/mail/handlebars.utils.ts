import { TemplateAdapterConfig } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import fs from 'fs';
import Handlebars from 'handlebars';
import { join } from 'path';

function registerPartial(name: string) {
  const file = fs.readFileSync(
    join(__dirname, `templates/partials/${name}.hbs`),
    'utf8',
  );
  if (!file) throw new Error(`Partial ${name} not found`);
  Handlebars.registerPartial(name, file);
}

export function handlebarsSetup() {
  registerPartial('header');
  registerPartial('footer');
}

export const defaultHandleBarsAdapterOptions: TemplateAdapterConfig = {
  inlineCssEnabled: true,
  inlineCssOptions: {
    minifyCss: true,
    keepStyleTags: false,
    keepLinkTags: false,
    removeInlinedSelectors: true,
  },
};

export const defaultHandleBarsAdapter = new HandlebarsAdapter(
  {},
  defaultHandleBarsAdapterOptions,
);
