/* jshint expr:true */
import { expect } from 'chai';
import {
    describe,
    it
} from 'mocha';
import sinon from 'sinon';
import Ember from 'ember';
// import validator from 'ghost/validators/tag-settings';
import ValidationEngine from 'ghost/mixins/validation-engine';

const {run} = Ember,
    Tag = Ember.Object.extend(ValidationEngine, {
        validationType: 'tag',

        name: null,
        description: null,
        meta_title: null,
        meta_description: null
    });

// TODO: These tests have way too much duplication, consider creating test
// helpers for validations

// TODO: Move testing of validation-engine behaviour into validation-engine-test
// and replace these tests with specific validator tests

describe('Unit: Validator: tag-settings', function () {
    it('validates all fields by default', function () {
        let tag = Tag.create({}),
            properties = tag.get('validators.tag.properties');

        // TODO: This is checking implementation details rather than expected
        // behaviour. Replace once we have consistent behaviour (see below)
        expect(properties, 'properties').to.include('name');
        expect(properties, 'properties').to.include('slug');
        expect(properties, 'properties').to.include('description');
        expect(properties, 'properties').to.include('metaTitle');
        expect(properties, 'properties').to.include('metaDescription');

        // TODO: .validate (and  by extension .save) doesn't currently affect
        // .hasValidated - it would be good to make this consistent.
        // The following tests currently fail:
        //
        // run(() => {
        //     tag.validate();
        // });
        //
        // expect(tag.get('hasValidated'), 'hasValidated').to.include('name');
        // expect(tag.get('hasValidated'), 'hasValidated').to.include('description');
        // expect(tag.get('hasValidated'), 'hasValidated').to.include('metaTitle');
        // expect(tag.get('hasValidated'), 'hasValidated').to.include('metaDescription');
    });

    it('passes with valid name', function () {
        // longest valid name
        let tag = Tag.create({name: (new Array(151).join('x'))}),
            passed = false;

        expect(tag.get('name').length, 'name length').to.equal(150);

        run(() => {
            tag.validate({property: 'name'}).then(() => {
                passed = true;
            });
        });

        expect(passed, 'passed').to.be.true;
        expect(tag.get('hasValidated'), 'hasValidated').to.include('name');
    });

    it('validates name presence', function () {
        let tag = Tag.create(),
            passed = false;

        // TODO: validator is currently a singleton meaning state leaks
        // between all objects that use it. Each object should either
        // get it's own validator instance or validator objects should not
        // contain state. The following currently fails:
        //
        // let validator = tag.get('validators.tag')
        // expect(validator.get('passed'), 'passed').to.be.false;

        run(() => {
            tag.validate({property: 'name'}).then(() => {
                passed = true;
            });
        });

        let nameErrors = tag.get('errors').errorsFor('name')[0];
        expect(nameErrors.attribute, 'errors.name.attribute').to.equal('name');
        expect(nameErrors.message, 'errors.name.message').to.equal('You must specify a name for the tag.');

        expect(passed, 'passed').to.be.false;
        expect(tag.get('hasValidated'), 'hasValidated').to.include('name');
    });

    it('validates names starting with a comma', function () {
        let tag = Tag.create({name: ',test'}),
            passed = false;

        run(() => {
            tag.validate({property: 'name'}).then(() => {
                passed = true;
            });
        });

        let nameErrors = tag.get('errors').errorsFor('name')[0];
        expect(nameErrors.attribute, 'errors.name.attribute').to.equal('name');
        expect(nameErrors.message, 'errors.name.message').to.equal('Tag names can\'t start with commas.');
        expect(tag.get('errors.length')).to.equal(1);

        expect(passed, 'passed').to.be.false;
        expect(tag.get('hasValidated'), 'hasValidated').to.include('name');
    });

    it('validates name length', function () {
        // shortest invalid name
        let tag = Tag.create({name: (new Array(152).join('x'))}),
            passed = false;

        expect(tag.get('name').length, 'name length').to.equal(151);

        run(() => {
            tag.validate({property: 'name'}).then(() => {
                passed = true;
            });
        });

        let nameErrors = tag.get('errors').errorsFor('name')[0];
        expect(nameErrors.attribute, 'errors.name.attribute').to.equal('name');
        expect(nameErrors.message, 'errors.name.message').to.equal('Tag names cannot be longer than 150 characters.');

        expect(passed, 'passed').to.be.false;
        expect(tag.get('hasValidated'), 'hasValidated').to.include('name');
    });

    it('passes with valid slug', function () {
        // longest valid slug
        let tag = Tag.create({slug: (new Array(151).join('x'))}),
            passed = false;

        expect(tag.get('slug').length, 'slug length').to.equal(150);

        run(() => {
            tag.validate({property: 'slug'}).then(() => {
                passed = true;
            });
        });

        expect(passed, 'passed').to.be.true;
        expect(tag.get('hasValidated'), 'hasValidated').to.include('slug');
    });

    it('validates slug length', function () {
        // shortest invalid slug
        let tag = Tag.create({slug: (new Array(152).join('x'))}),
            passed = false;

        expect(tag.get('slug').length, 'slug length').to.equal(151);

        run(() => {
            tag.validate({property: 'slug'}).then(() => {
                passed = true;
            });
        });

        let slugErrors = tag.get('errors').errorsFor('slug')[0];
        expect(slugErrors.attribute, 'errors.slug.attribute').to.equal('slug');
        expect(slugErrors.message, 'errors.slug.message').to.equal('URL cannot be longer than 150 characters.');

        expect(passed, 'passed').to.be.false;
        expect(tag.get('hasValidated'), 'hasValidated').to.include('slug');
    });

    it('passes with a valid description', function () {
        // longest valid description
        let tag = Tag.create({description: (new Array(201).join('x'))}),
            passed = false;

        expect(tag.get('description').length, 'description length').to.equal(200);

        run(() => {
            tag.validate({property: 'description'}).then(() => {
                passed = true;
            });
        });

        expect(passed, 'passed').to.be.true;
        expect(tag.get('hasValidated'), 'hasValidated').to.include('description');
    });

    it('validates description length', function () {
        // shortest invalid description
        let tag = Tag.create({description: (new Array(202).join('x'))}),
            passed = false;

        expect(tag.get('description').length, 'description length').to.equal(201);

        run(() => {
            tag.validate({property: 'description'}).then(() => {
                passed = true;
            });
        });

        let errors = tag.get('errors').errorsFor('description')[0];
        expect(errors.attribute, 'errors.description.attribute').to.equal('description');
        expect(errors.message, 'errors.description.message').to.equal('Description cannot be longer than 200 characters.');

        // TODO: tag.errors appears to be a singleton and previous errors are
        // not cleared despite creating a new tag object
        //
        // console.log(JSON.stringify(tag.get('errors')));
        // expect(tag.get('errors.length')).to.equal(1);

        expect(passed, 'passed').to.be.false;
        expect(tag.get('hasValidated'), 'hasValidated').to.include('description');
    });

    // TODO: we have both meta_title and metaTitle property names on the
    // model/validator respectively - this should be standardised
    it('passes with a valid meta_title', function () {
        // longest valid meta_title
        let tag = Tag.create({meta_title: (new Array(151).join('x'))}),
            passed = false;

        expect(tag.get('meta_title').length, 'meta_title length').to.equal(150);

        run(() => {
            tag.validate({property: 'metaTitle'}).then(() => {
                passed = true;
            });
        });

        expect(passed, 'passed').to.be.true;
        expect(tag.get('hasValidated'), 'hasValidated').to.include('metaTitle');
    });

    it('validates meta_title length', function () {
        // shortest invalid meta_title
        let tag = Tag.create({meta_title: (new Array(152).join('x'))}),
            passed = false;

        expect(tag.get('meta_title').length, 'meta_title length').to.equal(151);

        run(() => {
            tag.validate({property: 'metaTitle'}).then(() => {
                passed = true;
            });
        });

        let errors = tag.get('errors').errorsFor('meta_title')[0];
        expect(errors.attribute, 'errors.meta_title.attribute').to.equal('meta_title');
        expect(errors.message, 'errors.meta_title.message').to.equal('Meta Title cannot be longer than 150 characters.');

        expect(passed, 'passed').to.be.false;
        expect(tag.get('hasValidated'), 'hasValidated').to.include('metaTitle');
    });

    // TODO: we have both meta_description and metaDescription property names on
    // the model/validator respectively - this should be standardised
    it('passes with a valid meta_description', function () {
        // longest valid description
        let tag = Tag.create({meta_description: (new Array(201).join('x'))}),
            passed = false;

        expect(tag.get('meta_description').length, 'meta_description length').to.equal(200);

        run(() => {
            tag.validate({property: 'metaDescription'}).then(() => {
                passed = true;
            });
        });

        expect(passed, 'passed').to.be.true;
        expect(tag.get('hasValidated'), 'hasValidated').to.include('metaDescription');
    });

    it('validates meta_description length', function () {
        // shortest invalid meta_description
        let tag = Tag.create({meta_description: (new Array(202).join('x'))}),
            passed = false;

        expect(tag.get('meta_description').length, 'meta_description length').to.equal(201);

        run(() => {
            tag.validate({property: 'metaDescription'}).then(() => {
                passed = true;
            });
        });

        let errors = tag.get('errors').errorsFor('meta_description')[0];
        expect(errors.attribute, 'errors.meta_description.attribute').to.equal('meta_description');
        expect(errors.message, 'errors.meta_description.message').to.equal('Meta Description cannot be longer than 200 characters.');

        expect(passed, 'passed').to.be.false;
        expect(tag.get('hasValidated'), 'hasValidated').to.include('metaDescription');
    });
});
