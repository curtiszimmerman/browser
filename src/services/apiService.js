function ApiService(tokenService) {
    //this.baseUrl = 'http://localhost:4000';
    this.baseUrl = 'https://api.bitwarden.com';
    this.tokenService = tokenService;

    initApiService();
};

function initApiService() {
    // Auth APIs

    ApiService.prototype.postIdentityToken = function (tokenRequest, success, successWithTwoFactor, error) {
        var self = this;

        $.ajax({
            type: 'POST',
            url: self.baseUrl + '/connect/token',
            data: tokenRequest.toIdentityToken(),
            contentType: 'application/x-www-form-urlencoded; charset=utf-8',
            dataType: 'json',
            success: function (response) {
                success(new IdentityTokenResponse(response));
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.responseJSON && jqXHR.responseJSON.TwoFactorRequired &&
                    jqXHR.responseJSON.TwoFactorRequired === true) {
                    successWithTwoFactor();
                }
                else {
                    error(new ErrorResponse(jqXHR, true));
                }
            }
        });
    };

    // Account APIs

    ApiService.prototype.getAccountRevisionDate = function (success, error) {
        var self = this;
        handleTokenState(self).then(function (token) {
            $.ajax({
                type: 'GET',
                url: self.baseUrl + '/accounts/revision-date?access_token2=' + token,
                dataType: 'json',
                success: function (response) {
                    success(response);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    handleError(error, jqXHR);
                }
            });
        }, function (jqXHR) {
            handleError(error, jqXHR, true);
        });
    };

    ApiService.prototype.getProfile = function (success, error) {
        var self = this;
        handleTokenState(self).then(function (token) {
            $.ajax({
                type: 'GET',
                url: self.baseUrl + '/accounts/profile?access_token2=' + token,
                dataType: 'json',
                success: function (response) {
                    success(new ProfileResponse(response));
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    handleError(error, jqXHR);
                }
            });
        }, function (jqXHR) {
            handleError(error, jqXHR, true);
        });
    };

    ApiService.prototype.postPasswordHint = function (request, success, error) {
        var self = this;
        $.ajax({
            type: 'POST',
            url: self.baseUrl + '/accounts/password-hint',
            dataType: 'text',
            data: JSON.stringify(request),
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                success();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleError(error, jqXHR);
            }
        });
    };

    ApiService.prototype.postRegister = function (request, success, error) {
        var self = this;
        $.ajax({
            type: 'POST',
            url: self.baseUrl + '/accounts/register',
            data: JSON.stringify(request),
            dataType: 'text',
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                success();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleError(error, jqXHR);
            }
        });
    };

    // Settings APIs

    ApiService.prototype.getIncludedDomains = function (success, error) {
        var self = this;
        handleTokenState(self).then(function (token) {
            $.ajax({
                type: 'GET',
                url: self.baseUrl + '/settings/domains?excluded=false&access_token2=' + token,
                dataType: 'json',
                success: function (response) {
                    success(new DomainsResponse(response));
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    handleError(error, jqXHR);
                }
            });
        }, function (jqXHR) {
            handleError(error, jqXHR, true);
        });
    };

    // Login APIs

    ApiService.prototype.getLogin = function (id, success, error) {
        var self = this;
        handleTokenState(self).then(function (token) {
            $.ajax({
                type: 'GET',
                url: self.baseUrl + '/sites/' + id + '?access_token2=' + token,
                dataType: 'json',
                success: function (response) {
                    success(new LoginResponse(response));
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    handleError(error, jqXHR);
                }
            });
        }, function (jqXHR) {
            handleError(error, jqXHR, true);
        });
    };

    ApiService.prototype.postLogin = function (loginRequest, success, error) {
        var self = this;
        handleTokenState(self).then(function (token) {
            $.ajax({
                type: 'POST',
                url: self.baseUrl + '/sites?access_token2=' + token,
                data: JSON.stringify(loginRequest),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function (response) {
                    success(new LoginResponse(response));
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    handleError(error, jqXHR);
                }
            });
        }, function (jqXHR) {
            handleError(error, jqXHR, true);
        });
    };

    ApiService.prototype.putLogin = function (id, loginRequest, success, error) {
        var self = this;
        handleTokenState(self).then(function (token) {
            $.ajax({
                type: 'POST',
                url: self.baseUrl + '/sites/' + id + '?access_token2=' + token,
                data: JSON.stringify(loginRequest),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function (response) {
                    success(new LoginResponse(response));
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    handleError(error, jqXHR);
                }
            });
        }, function (jqXHR) {
            handleError(error, jqXHR, true);
        });
    };

    // Folder APIs

    ApiService.prototype.getFolder = function (id, success, error) {
        var self = this;
        handleTokenState(self).then(function (token) {
            $.ajax({
                type: 'GET',
                url: self.baseUrl + '/folders/' + id + '?access_token2=' + token,
                dataType: 'json',
                success: function (response) {
                    success(new FolderResponse(response));
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    handleError(error, jqXHR);
                }
            });
        }, function (jqXHR) {
            handleError(error, jqXHR, true);
    });
    };

    ApiService.prototype.postFolder = function (folderRequest, success, error) {
        var self = this;
        handleTokenState(self).then(function (token) {
            $.ajax({
                type: 'POST',
                url: self.baseUrl + '/folders?access_token2=' + token,
                data: JSON.stringify(folderRequest),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function (response) {
                    success(new FolderResponse(response));
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    handleError(error, jqXHR);
                }
            });
        }, function (jqXHR) {
            handleError(error, jqXHR, true);
        });
    };

    ApiService.prototype.putFolder = function (id, folderRequest, success, error) {
        var self = this;
        handleTokenState(self).then(function (token) {
            $.ajax({
                type: 'POST',
                url: self.baseUrl + '/folders/' + id + '?access_token2=' + token,
                data: JSON.stringify(folderRequest),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function (response) {
                    success(new FolderResponse(response));
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    handleError(error, jqXHR);
                }
            });
        }, function (jqXHR) {
            handleError(error, jqXHR, true);
        });
    };

    // Cipher APIs

    ApiService.prototype.getCipher = function (id, success, error) {
        var self = this;
        handleTokenState(self).then(function (token) {
            $.ajax({
                type: 'GET',
                url: self.baseUrl + '/ciphers/' + id + '?access_token2=' + token,
                dataType: 'json',
                success: function (response) {
                    success(new CipherResponse(response));
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    handleError(error, jqXHR);
                }
            });
        }, function (jqXHR) {
            handleError(error, jqXHR, true);
        });
    };

    ApiService.prototype.getCiphers = function (success, error) {
        var self = this;
        handleTokenState(self).then(function (token) {
            $.ajax({
                type: 'GET',
                url: self.baseUrl + '/ciphers?access_token2=' + token,
                dataType: 'json',
                success: function (response) {
                    var data = [];
                    for (var i = 0; i < response.Data.length; i++) {
                        data.push(new CipherResponse(response.Data[i]));
                    }

                    success(new ListResponse(data));
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    handleError(error, jqXHR);
                }
            });
        }, function (jqXHR) {
            handleError(error, jqXHR, true);
        });
    };

    ApiService.prototype.deleteCipher = function (id, success, error) {
        var self = this;
        handleTokenState(self).then(function (token) {
            $.ajax({
                type: 'POST',
                url: self.baseUrl + '/ciphers/' + id + '/delete?access_token2=' + token,
                dataType: 'text',
                success: function (response) {
                    success();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    handleError(error, jqXHR);
                }
            });
        }, function (jqXHR) {
            handleError(error, jqXHR, true);
        });
    };

    // Helpers

    function handleError(errorCallback, jqXHR, tokenError) {
        if (tokenError || jqXHR.status === 401 || jqXHR.status === 403) {
            chrome.runtime.sendMessage({ command: 'logout', expired: true });
            return;
        }

        errorCallback(new ErrorResponse(jqXHR));
    }

    function handleTokenState(self) {
        var deferred = Q.defer();
        self.tokenService.getToken(function (accessToken) {
            if (self.tokenService.tokenNeedsRefresh()) {
                self.tokenService.getRefreshToken(function (refreshToken) {
                    $.ajax({
                        type: 'POST',
                        url: self.baseUrl + '/connect/token',
                        data: {
                            grant_type: 'refresh_token',
                            client_id: 'browser',
                            refresh_token: refreshToken
                        },
                        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                        dataType: 'json',
                        success: function (response) {
                            var token = new IdentityTokenResponse(response);
                            tokenService.setTokens(token.accessToken, token.refreshToken, function () {
                                deferred.resolve(token.accessToken);
                            });
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            deferred.reject(jqXHR);
                        }
                    });
                });
            }
            else {
                deferred.resolve(accessToken);
            }
        });

        return deferred.promise
    }
};
