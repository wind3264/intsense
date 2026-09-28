# Trigonometric Substitution

Trigonometric substitution removes square roots of quadratics by turning them into a single trig function via a Pythagorean identity.

| Expression | Substitution | Identity used |
| --- | --- | --- |
| $\sqrt{a^2 - x^2}$ | $x = a \sin\theta$ | $1 - \sin^2\theta = \cos^2\theta$ |
| $\sqrt{a^2 + x^2}$ | $x = a \tan\theta$ | $1 + \tan^2\theta = \sec^2\theta$ |
| $\sqrt{x^2 - a^2}$ | $x = a \sec\theta$ | $\sec^2\theta - 1 = \tan^2\theta$ |

## Example

$$
\int_0^1 \sqrt{1 - x^2} \, dx
$$

Let $x = \sin\theta$, so $dx = \cos\theta \, d\theta$ and the bounds become $0$ to $\frac{\pi}{2}$:

$$
\int_0^{\pi/2} \cos^2\theta \, d\theta = \frac{\pi}{4}.
$$

This is also just the area of a quarter of the unit circle - a sanity check worth doing whenever it is available.

## Converting back

For indefinite integrals, draw a right triangle that encodes the substitution and read the other trig functions off it.
With $x = \tan\theta$ the triangle has legs $x$ and $1$ and hypotenuse $\sqrt{1 + x^2}$, so for instance

$$
\int \frac{dx}{(1 + x^2)^{3/2}} = \int \cos\theta \, d\theta = \sin\theta + C = \frac{x}{\sqrt{1 + x^2}} + C.
$$

## Speed tips

- The substitution $x = \tan\theta$ also turns $\frac{dx}{1 + x^2}$ into $d\theta$, which makes it useful even with no square root in sight.
- Completing the square first brings expressions like $\sqrt{2x - x^2}$ into one of the three forms above.
