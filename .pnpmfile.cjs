function readPackage(pkg, context) {
  if (pkg.dependencies["@nestjs/common"]) {
    pkg.dependencies["@nestjs/common"] = "^10.3.3";
  }

  if (pkg.dependencies["@nestjs/config"]) {
    pkg.dependencies["@nestjs/config"] = "^3.2.0";
  }

  if (pkg.dependencies["@nestjs/core"]) {
    pkg.dependencies["@nestjs/core"] = "^10.3.3";
  }

  if (pkg.dependencies["@nestjs/mongoose"]) {
    pkg.dependencies["@nestjs/mongoose"] = "^10.0.4";
  }

  if (pkg.dependencies["mongoose"]) {
    pkg.dependencies["mongoose"] = "^8.2.1";
  }

  if (pkg.dependencies["joi"]) {
    pkg.dependencies["joi"] = "^17.12.2";
  }

  if (pkg.dependencies["typescript"]) {
    pkg.dependencies["typescript"] = "^5.3.3";
  }

  return pkg;
}

module.exports = {
  hooks: {
    readPackage
  }
};
