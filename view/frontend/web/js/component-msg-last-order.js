/**
 * Copyright ©  All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'uiElement',
    'jquery',
    'ko',
    'mage/url',
    'mage/translate'
], function (Component, $, ko, urlBuilder, $t) {
    'use strict';

    return Component.extend({
        isVisible: ko.observable(false),
        orderLink: ko.observable(''),
        orderDate: ko.observable(''),

        /**
         * Initializes the function.
         *
         * @param {Object} config - The configuration object.
         * @param {number} config.customerId - The ID of the customer.
         * @param {number} config.productId - The ID of the product.
         */
        initialize: function (config) {
            const { customerId, productId } = config;
            
            this._super();
            this.makeGraphQLRequest();
        },

        /**
         * Makes a GraphQL request to check if a customer has purchased a product.
         */
        makeGraphQLRequest: function () {
            var self = this;

            var urlGraphql = urlBuilder.build('graphql');

            var requestConfig = {
                url: urlGraphql,
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify({
                    query: `
                        query CheckCustomerProductPurchase($customerId: String!, $productId: String!) {
                            hasCustomerPurchasedProduct(customerId: $customerId, productId: $productId) {
                                hasPurchased
                                orderLink
                                orderDate
                            }
                        }
                    `,
                    variables: {
                        customerId: self.customerId,
                        productId: self.productId
                    }
                })
            };

            $.ajax(requestConfig).done(function (response) {
                const { hasCustomerPurchasedProduct } = response.data || {};
                const { hasPurchased, orderLink, orderDate } = hasCustomerPurchasedProduct || {};

                if (hasPurchased) {
                    self.isVisible(true);
                }
                
                self.orderLink(orderLink);
                self.orderDate(orderDate);
            }).fail(function (error) {
                console.log(error);
            });
        }
    });
});
