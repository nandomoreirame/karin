'use strict'

import gulp from 'gulp'
import plugins from 'gulp-load-plugins'
import bourbon from 'node-bourbon'
import pkg from '../package.json'

const $ = plugins()

const plumberHandler = {
  errorHandler: $.notify.onError({
    title: 'gulp',
    message: 'Error: <%= error.message %>'
  })
}

const banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @license <%= pkg.license %>',
  ' * @copyright 2016 <%= pkg.author %>.',
  ' * @link https://github.com/lojaskd/karin',
  ' */',
  ''].join('\n')

gulp.task('stylesheets', () => gulp.src([ `sass/**/*.sass` ])
  .pipe($.plumber(plumberHandler))
  .pipe($.sass({
    compass: true,
    sourcemap: false,
    noCache: true,
    style: 'nested',
    sourceComments: false,
    includePaths: [
      bourbon.includePaths,
      `sass`,
      `node_modules`,
      `bower`
    ]
  }))
  .pipe($.autoprefixer({
    browsers: [
      'ie >= 9',
      'ie_mob >= 10',
      'ff >= 30',
      'chrome >= 34',
      'safari >= 5',
      'opera >= 23',
      'ios >= 6',
      'android >= 4.4',
      'bb >= 10'
    ],
    cascade: false
  }))
  .pipe($.combineMq())
  .pipe($.size({ title: 'Stylesheets!', gzip: false, showFiles: true }))
  .pipe($.header(banner, { pkg }))
  .pipe(gulp.dest(`dist/stylesheets`))
  .pipe($.rename({ suffix: '.min' }))
  .pipe($.cssnano())
  .pipe($.size({ title: 'Stylesheets minified!', gzip: false, showFiles: true }))
  .pipe($.header(banner, { pkg }))
  .pipe(gulp.dest(`dist/stylesheets`))
  .pipe($.plumber.stop()))
