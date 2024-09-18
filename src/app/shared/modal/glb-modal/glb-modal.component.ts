import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { SceneService } from '../../services/scene-service/scene-service.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-glb-modal',
    templateUrl: './glb-modal.component.html',
    styleUrls: ['./glb-modal.component.scss'],
    providers: [SceneService]
})
export class GlbModalComponent implements OnInit {

    constructor(
        private scene: SceneService,
        public dialogRef: MatDialogRef<GlbModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    @ViewChild('container')
    set container(container: ElementRef) {
        this.scene.initialize(container.nativeElement, this.data);
    }

    ngOnInit(): void { }

    cancel() {
        this.dialogRef.close(false);
    }

}
