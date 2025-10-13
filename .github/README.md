# GitHub Configuration

This directory contains GitHub-specific configuration files for CI/CD, issue templates, and pull request templates.

## Directory Structure

```
.github/
├── workflows/              # GitHub Actions workflows
│   ├── ci.yml             # Continuous Integration
│   ├── deploy-staging.yml # Staging deployment
│   └── contract-test.yml  # Smart contract testing
├── ISSUE_TEMPLATE/        # Issue templates
│   ├── bug_report.md      # Bug report template
│   └── feature_request.md # Feature request template
├── PULL_REQUEST_TEMPLATE.md # PR template
├── ENV_SETUP.md           # Environment variables guide
└── README.md              # This file
```

## Workflows

### ci.yml - Continuous Integration

Runs on every push and pull request to `main` and `develop` branches.

**Jobs:**

- **Lint**: ESLint checks across all packages
- **Type Check**: TypeScript compilation checks
- **Build**: Build all packages using Turborepo
- **CI Success**: Summary job for branch protection

**Optimizations:**

- Uses pnpm cache for faster dependency installation
- Uses Turborepo cache for faster builds
- Runs jobs in parallel when possible

### contract-test.yml - Smart Contract Tests

Runs when contracts code changes.

**Jobs:**

- **Foundry Tests**: Run all Solidity tests with coverage
- **Slither Analysis**: Security vulnerability scanning

**Features:**

- Detailed test output with `-vvv` flag
- Gas reports for optimization
- Coverage reporting to Codecov
- Security analysis artifacts

### deploy-staging.yml - Staging Deployment

Runs on push to `develop` branch.

**Jobs:**

- **Deploy Frontend**: Deploy to Vercel preview
- **Deploy Backend**: Placeholder for future AWS deployment

**Features:**

- Automatic Vercel deployment
- PR comments with preview URLs
- Environment-specific configurations

## Issue Templates

### Bug Report (`bug_report.md`)

Template for reporting bugs with sections for:

- Description
- Reproduction steps
- Expected vs actual behavior
- Environment details
- Error logs

### Feature Request (`feature_request.md`)

Template for suggesting new features with sections for:

- Feature description
- Problem statement
- Proposed solution
- User story format
- Acceptance criteria

## Pull Request Template

Standard PR template with sections for:

- Description and issue reference
- Type of change
- Story reference
- Testing checklist
- Code review checklist

## Setup Instructions

### 1. Configure GitHub Secrets

Go to GitHub Settings → Secrets and variables → Actions, and add:

- `VERCEL_TOKEN` - Get from Vercel dashboard
- `VERCEL_ORG_ID` - Found in Vercel project settings
- `VERCEL_PROJECT_ID` - Found in Vercel project settings

### 2. Enable GitHub Actions

GitHub Actions should be enabled by default. Verify in:
Settings → Actions → General → Allow all actions

### 3. Configure Branch Protection

Recommended settings for `main` branch:

- Require pull request reviews (1 approval)
- Require status checks to pass (select "CI Success")
- Require branches to be up to date

### 4. Vercel Integration

1. Install Vercel GitHub App
2. Import the repository
3. Configure environment variables
4. Enable automatic deployments

## Useful Commands

```bash
# Test workflows locally using act
act -l  # List all workflows

# Validate workflow syntax
actionlint .github/workflows/*.yml

# Check if secrets are configured
gh secret list
```

## Caching Strategy

### pnpm Dependencies

- Cache key: `node-${{ hashFiles('**/pnpm-lock.yaml') }}`
- Cached by setup-node action

### Turborepo

- Cache key: `${{ runner.os }}-turbo-${{ github.sha }}`
- Fallback: Previous builds on same OS
- Dramatically speeds up builds (up to 10x)

### Foundry

- Cache key: Automatic via foundry-toolchain action
- Caches compiled contracts and dependencies

## Monitoring

- **Workflow runs**: Actions tab in GitHub
- **Status badges**: Available in repository settings
- **Notifications**: Configure in GitHub notifications settings

## Troubleshooting

### Workflows not running?

- Check if Actions are enabled in repository settings
- Verify workflow syntax (YAML)
- Check if branch/path filters match

### Build failing?

- Check workflow logs in Actions tab
- Verify dependencies are up to date
- Test locally: `pnpm install && pnpm build`

### Vercel deployment failing?

- Verify secrets are configured correctly
- Check Vercel dashboard for detailed logs
- Ensure environment variables are set

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Turborepo CI/CD Guide](https://turbo.build/repo/docs/ci)
- [Vercel Deployments](https://vercel.com/docs/deployments)
- [Foundry CI](https://book.getfoundry.sh/config/continous-integration)
