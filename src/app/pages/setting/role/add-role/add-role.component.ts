import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { AlertService } from 'src/app/shared/services/alert-service/alert.service';
import { BaseService } from 'src/app/shared/services/base-service/base.service';

@Component({
    selector: 'app-add-role',
    templateUrl: './add-role.component.html',
    styleUrls: ['./add-role.component.scss'],
})
export class AddRoleComponent implements OnInit {

    groups: any[] = [];
    permissions: any[] = [];
    rolePermissions: any[] = [];
    form: FormGroup;
    roleId: string;
    isLoading: boolean;

    constructor(private fb: FormBuilder,
        private router: Router,
        private activateRoute: ActivatedRoute,
        private _location: Location,
        private alertService: AlertService,
        private baseService: BaseService) {
        this.form = this.fb.group({
            name: [null, Validators.required],
            description: [null]
        });
    }

    ngOnInit(): void {
        this.getParam();
        this.getPermission();
    }

    public removeDuplicates(moduleArr, module_name) {
        return moduleArr.filter((obj, pos, arr) => {
            return arr.map(mapObj => mapObj[module_name]).indexOf(obj[module_name]) === pos;
        });
    }

    getPermission() {
        this.baseService.getPermission().subscribe(response => {
            if (response && response['success']) {
                const moduleArr = [];
                const allprops = [];
                response['data'].data.forEach(prop => {
                    allprops.push(prop);
                    moduleArr.push({ module_name: prop['module_name'], arrs: [] });
                });
                const modules = this.removeDuplicates(moduleArr, 'module_name');
                const rolepermission = modules;
                for (var i = 0; i < modules.length; i++) {
                    let array: any[] = []
                    allprops.filter(function (props) {
                        if (props.module_name == rolepermission[i].module_name) {
                            props['selected'] = false;
                            array.push(props);
                        }
                    })
                    rolepermission[i].arrs = array;
                }
                this.permissions = rolepermission;
                if (this.roleId && this.permissions && this.permissions.length) this.getPermissionByRole();
            }
        });
    }

    emitResponse() {
        this.getParam();
    }

    getParam() {
        this.activateRoute.params.subscribe(data => {
            this.roleId = data['id'];
            if (this.roleId) {
                this.isLoading = true;
                this.getRoleDetail();
            }
        });
    }

    getPermissionByRole() {
        this.baseService.getPermissionByRole(this.roleId).subscribe(response => {
            if (response && response['success']) {
                this.permissions.forEach(prop => {
                    prop.arrs.forEach(arr => {
                        const permissionCheck = response['data'].data.findIndex(data => data.permission_id === arr.permission_id);
                        if (permissionCheck > -1) arr.selected = true;
                    });
                });
            }
        });
    }

    getRoleDetail() {
        this.isLoading = true;
        this.baseService.getRole(this.roleId).subscribe(response => {
            if (response && response['success']) {
                this.isLoading = false;
                this.roleDetailPatch(response['data'].data);
                this.groups = response['data'].data.groups;
            } else {
                this.isLoading = false;
            }
        });
    }

    roleDetailPatch(data) {
        this.form.patchValue({
            name: data.name,
            description: data.description
        });
    }

    back() {
        this._location.back();
    }

    onSubmit() {
        this.isLoading = true;
        if (this.roleId) this.updateRole(this.roleId);
        else this.createRole();
    }

    createRole() {
        this.baseService.createRole(this.form.value).subscribe(response => {
            if (response && response['success']) {
                this.isLoading = false;
                this.router.navigate(['setting/role-list']);
            } else this.isLoading = false;
        }, error => {
            const { reason } = error.error;
            const keys = Object.keys(reason);
            keys.forEach((key, index) => {
                this.alertService.multipleAlert(reason[key][0], index);
            });
            this.isLoading = false;
        });
    }

    updateRole(roleId) {
        this.baseService.updateRole(this.form.value, roleId).subscribe(response => {
            if (response && response['success']) {
                this.isLoading = false;
                this.router.navigate(['setting/role-list']);
            } else this.isLoading = false;
        }, error => {
            const { reason } = error.error;
            const keys = Object.keys(reason);
            keys.forEach((key, index) => {
                this.alertService.multipleAlert(reason[key][0], index);
            });
            this.isLoading = false;
        });
    }

}