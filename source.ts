import * as ts from "typescript";

class Test1 {

    constructor(private service: ApiService) {

    }

    public visitImportDeclaration(ss: string) {
        this.service.getSth("Text from Test1");
    }


}

class Test2 {
    constructor(private service: ApiService) {

    }

    public visitImportDeclaration(ss: string) {
        this.service.getSth("Text from Test1");
    }
}

class Main {
    public Run() {
        let apiService = new ApiService();
        let test1 = new Test1(apiService);
        let test2 = new Test2(apiService);

        apiService.getSth("From main");
    }
}

class ApiService {
    public getSth(ss: string) {
    }

    public getSth2(ss: string) {
    }
}