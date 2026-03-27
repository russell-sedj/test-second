import { Component, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-demarches',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './demarches.html',
  styleUrl: './demarches.css',
})
export class Demarches implements OnInit {
  form: FormGroup;
  submitted = false;
  success = false;
  sending = false;
  apiError = '';
  selectedFile: File | null = null;
  fileError = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private title: Title,
    private meta: Meta,
    private api: ApiService,
  ) {
    this.form = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.minLength(8)]],
      typeDemande: ['', [Validators.required]],
      objet: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(20)]],
      consentement: [false, Validators.requiredTrue],
    });
  }

  ngOnInit() {
    this.title.setTitle('Depot de documents - Mairie de Mbaling');
    this.meta.updateTag({
      name: 'description',
      content: 'Envoyez vos documents administratifs en ligne a la mairie de Mbaling.',
    });

    this.route.queryParamMap.subscribe((params) => {
      const typeDemande = params.get('typeDemande');
      if (typeDemande) {
        this.form.patchValue({ typeDemande });
      }
    });
  }

  get f() {
    return this.form.controls;
  }

  onFileSelected(event: Event) {
    this.fileError = '';
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    if (!file) {
      this.selectedFile = null;
      return;
    }

    const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowed.includes(file.type)) {
      this.fileError = 'Formats autorises: PDF, JPG, PNG';
      this.selectedFile = null;
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      this.fileError = 'Taille maximale: 10 MB';
      this.selectedFile = null;
      return;
    }

    this.selectedFile = file;
  }

  onSubmit() {
    this.submitted = true;
    this.apiError = '';

    if (this.form.invalid) return;
    if (!this.selectedFile) {
      this.fileError = 'Veuillez joindre un document';
      return;
    }

    this.sending = true;

    const fd = new FormData();
    fd.append('nom', this.form.value.nom);
    fd.append('prenom', this.form.value.prenom);
    fd.append('email', this.form.value.email);
    fd.append('telephone', this.form.value.telephone);
    fd.append('type_demande', this.form.value.typeDemande);
    fd.append('objet', this.form.value.objet);
    fd.append('message', this.form.value.message);
    fd.append('fichier', this.selectedFile);

    this.api.submitDocument(fd).subscribe({
      next: () => {
        this.success = true;
        this.sending = false;
        this.form.reset();
        this.submitted = false;
        this.selectedFile = null;
      },
      error: (err) => {
        this.apiError = err.error?.message || "Une erreur est survenue. Veuillez reessayer.";
        this.sending = false;
      },
    });
  }
}