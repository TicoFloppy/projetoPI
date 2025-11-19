import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClientesService } from '../../core/services/clientes.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cadastrar',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './cadastrar.component.html',
  styleUrl: './cadastrar.component.css',
})
export class CadastrarComponent {
  cpfInvalido = false;

  cliente: any = {
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    cpf: '',
  };

  constructor(private service: ClientesService, private router: Router) {}

  formatarCPF() {
    let cpf = this.cliente.cpf.replace(/\D/g, '');

    if (cpf.length > 11) cpf = cpf.substring(0, 11);

    if (cpf.length <= 3) {
      this.cliente.cpf = cpf;
    } else if (cpf.length <= 6) {
      this.cliente.cpf = cpf.replace(/(\d{3})(\d+)/, '$1.$2');
    } else if (cpf.length <= 9) {
      this.cliente.cpf = cpf.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
    } else {
      this.cliente.cpf = cpf.replace(
        /(\d{3})(\d{3})(\d{3})(\d+)/,
        '$1.$2.$3-$4'
      );
    }
  }

  validarCPF(cpf: string): boolean {
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    let resto = 0;

    for (let i = 1; i <= 9; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
  }

  submeter() {
    this.cpfInvalido = !this.validarCPF(this.cliente.cpf);

    if (this.cpfInvalido) {
      alert('CPF inválido!');
      return;
    }

    this.service.incluir(this.cliente).subscribe(() => {
      alert('Cadastro realizado com sucesso!');
      this.router.navigate(['/']);
    });
  }
}
